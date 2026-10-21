// Captures the README media from a running LexAgent in demo mode (LLM_API_KEY empty):
// screenshots and PDF page previews.
// Usage: node docs/readme/capture.mjs [shots,pdf] [baseUrl]
// Needs: docs/readme/sample-report.pdf (scripts/render-sample-pdf.tsx) and ffmpeg on PATH.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ONLY = (process.argv[2] ?? "shots,pdf").split(",");
const BASE = process.argv[3] ?? "http://127.0.0.1:3101";
const browser = await chromium.launch();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function context({ theme = "light", lang = "en", session = true, ...opts } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, ...opts });
  await ctx.addInitScript(
    ([t, l, s]) => {
      localStorage.setItem("lexagent.theme", t);
      if (!localStorage.getItem("lexagent.lang")) localStorage.setItem("lexagent.lang", l);
      if (s && !localStorage.getItem("lexagent.session")) {
        localStorage.setItem("lexagent.session", JSON.stringify({ name: "Asha Verma", email: "asha@lexagent.test", role: "advocate" }));
      }
    },
    [theme, lang, session],
  );
  return ctx;
}

async function analyzedDashboard(page, sample = /Cheque bounce|चेक बाउंस/) {
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole("button", { name: sample }).click();
  await page.locator(".analyze-btn").click();
  await page.locator(".results-bar .btn-primary").waitFor({ timeout: 30_000 });
}

// 1. Screenshots
if (ONLY.includes("shots")) {
  for (const theme of ["light", "dark"]) {
    const ctx = await context({ theme });
    const page = await ctx.newPage();
    await page.goto(BASE);
    await wait(6500); // let the case-file annotation and stamp finish
    await page.screenshot({ path: join(here, `landing-${theme}.png`) });
    await analyzedDashboard(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(400);
    await page.screenshot({ path: join(here, `dashboard-${theme}.png`) });
    await page.locator(".result").nth(1).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -90));
    await wait(300);
    await page.screenshot({ path: join(here, `insights-${theme}.png`) });
    await ctx.close();
  }
  {
    // README hero: an English case file uploaded as a PDF and analysed (demo mode recognises the sample file).
    const ctx = await context({});
    const page = await ctx.newPage();
    await page.goto(`${BASE}/dashboard`);
    await page.locator("input[type=file]").setInputFiles(join(here, "../../sample-cases/03-job-fraud-cheating-bns.pdf"));
    await page.locator(".file-pill").waitFor();
    await page.locator(".analyze-btn").click();
    await page.locator(".results-bar .btn-primary").waitFor({ timeout: 30_000 });
    await page.evaluate(() => window.scrollTo(0, document.querySelector(".dash-grid").offsetTop - 90));
    await wait(500);
    await page.screenshot({ path: join(here, "dashboard-hero.png") });
    await ctx.close();
  }
  {
    const ctx = await context({ theme: "dark", viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await analyzedDashboard(page, /Defective phone/);
    await page.locator(".progress").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await wait(300);
    await page.screenshot({ path: join(here, "mobile-dark.png") });
    await ctx.close();
  }
}

// Screenshots are converted to JPEG (the paper grain makes PNGs several MB each).
if (ONLY.includes("shots")) {
  for (const f of ["dashboard-hero", "landing-light", "landing-dark", "dashboard-light", "dashboard-dark", "insights-light", "insights-dark", "mobile-dark"]) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(here, `${f}.png`), "-q:v", "3", join(here, `${f}.jpg`)]);
    rmSync(join(here, `${f}.png`));
  }
}

// 2. PDF report pages, rendered with pdf.js on a fake origin served from disk
if (ONLY.includes("pdf")) {
  for (const [pdfFile, prefix, count] of [
    ["sample-report.pdf", "report-page", 3],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1.5 });
    const files = {
      "/pdf.min.mjs": ["text/javascript", readFileSync(join(here, "../../node_modules/pdfjs-dist/build/pdf.min.mjs"))],
      "/pdf.worker.min.mjs": ["text/javascript", readFileSync(join(here, "../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs"))],
      "/report.pdf": ["application/pdf", readFileSync(join(here, pdfFile))],
      "/": [
        "text/html",
        `<body style="margin:0;background:#fff"><canvas id="c"></canvas><script type="module">
        import * as pdfjs from "/pdf.min.mjs";
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: "/report.pdf" }).promise;
        window.renderPage = async (n) => {
          const page = await doc.getPage(n);
          const vp = page.getViewport({ scale: 2 });
          const c = document.getElementById("c");
          c.width = vp.width; c.height = vp.height; c.style.width = vp.width / 2 + "px";
          await page.render({ canvas: c, canvasContext: c.getContext("2d"), viewport: vp }).promise;
        };
        window.pages = doc.numPages;
      </script></body>`,
      ],
    };
    await ctx.route("https://render.local/**", (route) => {
      const path = new URL(route.request().url()).pathname;
      const [type, body] = files[path] ?? ["text/plain", "not found"];
      return route.fulfill({ status: files[path] ? 200 : 404, contentType: type, body });
    });
    const page = await ctx.newPage();
    await page.goto("https://render.local/");
    await page.waitForFunction(() => window.pages > 0);
    const total = await page.evaluate(() => window.pages);
    for (let n = 1; n <= Math.min(total, count); n++) {
      await page.evaluate((i) => window.renderPage(i), n);
      await page.locator("#c").screenshot({ path: join(here, `${prefix}-${n}.png`) });
    }
    await ctx.close();
  }
}

await browser.close();
console.log("captured README media");
