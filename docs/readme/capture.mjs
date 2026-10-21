// Captures the README media from a running LexAgent in demo mode (LLM_API_KEY empty):
// screenshots, PDF page previews and a full-HD demo video (MP4 + animated WebP + GIF fallback).
// Usage: node docs/readme/capture.mjs [shots,pdf,video] [baseUrl]
// Needs: docs/readme/sample-report.pdf and sample-report-hi.pdf (scripts/render-sample-pdf.tsx), and ffmpeg on PATH.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ONLY = (process.argv[2] ?? "shots,pdf,video").split(",");
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
    const ctx = await context({ lang: "hi" });
    const page = await ctx.newPage();
    await page.goto(BASE);
    await wait(6500);
    await page.screenshot({ path: join(here, "landing-hi.png") });
    await ctx.close();
  }
  {
    const ctx = await context({ lang: "mr", session: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/signup`);
    await wait(1200);
    await page.locator(".auth-card").screenshot({ path: join(here, "signup-roles-mr.png") });
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
  for (const f of ["landing-light", "landing-dark", "landing-hi", "dashboard-light", "dashboard-dark", "insights-light", "insights-dark", "mobile-dark", "signup-roles-mr"]) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(here, `${f}.png`), "-q:v", "3", join(here, `${f}.jpg`)]);
    rmSync(join(here, `${f}.png`));
  }
}

// 2. PDF report pages, rendered with pdf.js on a fake origin served from disk
if (ONLY.includes("pdf")) {
  for (const [pdfFile, prefix, count] of [
    ["sample-report.pdf", "report-page", 3],
    ["sample-report-hi.pdf", "report-hi-page", 1],
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

// 3. Demo video at 1920x1080 using Chrome's screencast (much sharper than Playwright's built-in recorder).
if (ONLY.includes("video")) {
  const framesDir = join(here, "_frames");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir);
  const ctx = await context({ theme: "light", session: false, viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  // The paper-grain overlay is random noise, which video codecs can't compress; hide it for the recording.
  await ctx.addInitScript(() =>
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = "body::before{display:none!important}";
      document.head.append(style);
    }),
  );
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = join(framesDir, `f${String(frames.length).padStart(5, "0")}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({ file, t: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  const smoothScroll = async (px, ms) => {
    const steps = Math.round(ms / 16);
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, px / steps);
      await wait(16);
    }
  };

  await page.goto(BASE);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await wait(6000);
  await page.mouse.move(640, 400);
  await smoothScroll(900, 1800);
  await wait(900);
  await smoothScroll(-900, 1200);
  await wait(400);
  await page.getByRole("link", { name: "File a case" }).first().click();
  await page.getByLabel("Full name").pressSequentially("Asha Verma", { delay: 45 });
  await page.getByLabel("Email").pressSequentially("asha@lexagent.test", { delay: 30 });
  await page.getByLabel("Password").pressSequentially("demo-pass", { delay: 30 });
  await page.locator(".role-opt").nth(2).click(); // Advocate
  await wait(700);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: /Cheque bounce/ }).waitFor();
  await wait(1200);
  await page.getByRole("button", { name: "म" }).click(); // switch the interface to Marathi
  await wait(1500);
  // Upload a Marathi district-court case file (DOCX), as a user would.
  await page.locator('input[type=file]').setInputFiles(join(here, "../../sample-cases/06-farm-road-injunction-marathi.docx"));
  await wait(1600);
  await page.locator(".analyze-btn").click();
  await page.locator(".results-bar .btn-primary").waitFor({ timeout: 30_000 });
  await wait(1400);
  await page.mouse.move(900, 500);
  await smoothScroll(1400, 2600);
  await wait(700);
  await smoothScroll(1500, 2600);
  await wait(700);
  await smoothScroll(1600, 2600);
  await wait(1000);
  await smoothScroll(-4500, 2000);
  await wait(800);
  const download = page.waitForEvent("download");
  await page.locator(".results-bar .btn-primary").click();
  await download;
  await wait(1500);
  await cdp.send("Page.stopScreencast");
  await ctx.close();

  // Frames arrive only when the screen changes, so give each frame its real duration.
  const lines = frames.map((f, i) => {
    const next = frames[i + 1]?.t ?? f.t + 1;
    return `file '${f.file.replace(/\\/g, "/")}'\nduration ${Math.max(0.001, next - f.t).toFixed(3)}`;
  });
  writeFileSync(join(framesDir, "list.txt"), `${lines.join("\n")}\nfile '${frames.at(-1).file.replace(/\\/g, "/")}'\n`);
  const ff = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  ff("-f", "concat", "-safe", "0", "-i", join(framesDir, "list.txt"), "-vf", "fps=30,scale=1920:1080:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-tune", "animation", "-movflags", "+faststart", join(here, "demo.mp4"));
  // README preview: the dashboard part (sample → agents → results), sped up 1.5x.
  const clip = ["-ss", "17", "-t", "30", "-i", join(here, "demo.mp4")];
  ff(...clip, "-vf", "setpts=PTS/1.5,fps=12,scale=1000:-1:flags=lanczos", "-c:v", "libwebp_anim", "-quality", "70", "-compression_level", "6", "-loop", "0", join(here, "demo.webp"));
  ff(...clip, "-vf", "setpts=PTS/1.5,fps=8,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle", join(here, "demo.gif"));
  rmSync(framesDir, { recursive: true, force: true });
}

await browser.close();
console.log("captured README media");
