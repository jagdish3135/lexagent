// Captures the README media from a running LexAgent (demo mode): screenshots, PDF page previews and a demo video.
// Usage: start the app (npm run build && npm start -- -p 3100), then
//   node docs/readme/capture.mjs [shots,pdf,video] [baseUrl]
// Needs: docs/readme/sample-report.pdf (npx tsx scripts/render-sample-pdf.tsx cheque docs/readme/sample-report.pdf)
import { chromium } from "playwright";
import { readFileSync, renameSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ONLY = (process.argv[2] ?? "shots,pdf,video").split(",");
const BASE = process.argv[3] ?? "http://127.0.0.1:3101"; // a server in demo mode (LLM_API_KEY empty)
const browser = await chromium.launch();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function context(theme, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, ...opts });
  await ctx.addInitScript((t) => {
    localStorage.setItem("lexagent.theme", t);
    if (!localStorage.getItem("lexagent.session")) {
      localStorage.setItem("lexagent.session", JSON.stringify({ name: "Asha Verma", email: "asha@lexagent.test" }));
    }
  }, theme);
  return ctx;
}

async function analyzedDashboard(page, sample = "Cheque bounce") {
  await page.goto(`${BASE}/dashboard`);
  await page.getByRole("button", { name: new RegExp(sample) }).click();
  await page.getByRole("button", { name: /Analyze Case/ }).click();
  await page.getByRole("button", { name: /Export PDF report/ }).waitFor({ timeout: 30_000 });
}

// 1. Screenshots in both themes
for (const theme of ONLY.includes("shots") ? ["light", "dark"] : []) {
  const ctx = await context(theme);
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

// Phone screenshot
if (ONLY.includes("shots")) {
  const ctx = await context("dark", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await analyzedDashboard(page, "Defective phone");
  await page.locator(".progress").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80));
  await wait(300);
  await page.screenshot({ path: join(here, "mobile-dark.png") });
  await ctx.close();
}

// 2. PDF report pages, rendered with pdf.js on a fake origin served from disk
if (ONLY.includes("pdf")) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1.5 });
  const files = {
    "/pdf.min.mjs": ["text/javascript", readFileSync(join(here, "../../node_modules/pdfjs-dist/build/pdf.min.mjs"))],
    "/pdf.worker.min.mjs": ["text/javascript", readFileSync(join(here, "../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs"))],
    "/report.pdf": ["application/pdf", readFileSync(join(here, "sample-report.pdf"))],
    "/": ["text/html", `<body style="margin:0;background:#fff"><canvas id="c"></canvas><script type="module">
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
    </script></body>`],
  };
  await ctx.route("https://render.local/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    const [type, body] = files[path] ?? ["text/plain", "not found"];
    return route.fulfill({ status: files[path] ? 200 : 404, contentType: type, body });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("pdf page error:", e.message));
  page.on("console", (m) => m.type() === "error" && console.error("pdf console:", m.text()));
  await page.goto("https://render.local/");
  await page.waitForFunction(() => window.pages > 0);
  const total = await page.evaluate(() => window.pages);
  for (let n = 1; n <= Math.min(total, 3); n++) {
    await page.evaluate((i) => window.renderPage(i), n);
    await page.locator("#c").screenshot({ path: join(here, `report-page-${n}.png`) });
  }
  await ctx.close();
}

// 3. Demo video: landing -> sign up -> sample case -> live agents -> results -> PDF export
if (ONLY.includes("video")) {
  const videoDir = join(here, "_video");
  rmSync(videoDir, { recursive: true, force: true });
  mkdirSync(videoDir);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } } });
  await ctx.addInitScript(() => localStorage.setItem("lexagent.theme", "dark"));
  const page = await ctx.newPage();
  const smoothScroll = async (px, steps = 40) => {
    for (let i = 0; i < steps; i++) {
      await page.evaluate((d) => window.scrollBy(0, d), px / steps);
      await wait(22);
    }
  };

  await page.goto(BASE);
  await wait(5800);
  await smoothScroll(700);
  await wait(1200);
  await smoothScroll(-700);
  await page.getByRole("link", { name: "File a case" }).click();
  await page.getByLabel("Full name").pressSequentially("Asha Verma", { delay: 45 });
  await page.getByLabel("Email").pressSequentially("asha@lexagent.test", { delay: 35 });
  await page.getByLabel("Password").pressSequentially("demo-pass", { delay: 35 });
  await wait(400);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: /Cheque bounce/ }).waitFor();
  await wait(1500);
  await page.getByRole("button", { name: /Cheque bounce/ }).click();
  await wait(1400);
  await page.getByRole("button", { name: /Analyze Case/ }).click();
  await page.getByRole("button", { name: /Export PDF report/ }).waitFor({ timeout: 30_000 });
  await wait(1500);
  await smoothScroll(1500, 90);
  await wait(800);
  await smoothScroll(1600, 90);
  await wait(800);
  await smoothScroll(1700, 90);
  await wait(1200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await wait(1200);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export PDF report/ }).click();
  await download;
  await wait(1500);
  await ctx.close();
  const [file] = readdirSync(videoDir);
  renameSync(join(videoDir, file), join(here, "demo-raw.webm"));
  rmSync(videoDir, { recursive: true, force: true });
}

await browser.close();
console.log("captured README media");
