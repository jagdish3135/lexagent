// Builds the sample-cases/ folder: fictional Indian case documents (English, Marathi, Hindi) as PDF, DOCX and TXT,
// for trying LexAgent's upload. English PDFs are printed by Chromium; Hindi/Marathi PDFs are image-only scans,
// read by LexAgent's OCR, like the scanned court copies people actually have.
// Usage: npm run samples
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { crc32 } from "node:zlib";
import { chromium } from "playwright";
import { SAMPLES } from "../src/lib/samples";

const isHeading = (line: string) => {
  const l = line.trim();
  return /^[A-Z][A-Z .,'()0-9-]{12,}$/.test(l) || /^(अनावेदक का जवाब|प्रार्थना|मागणी|प्रतिवादी यांचे लेखी म्हणणे)$/.test(l) || / (दावा|आवेदन)$/.test(l);
};

// --- DOCX: a minimal WordprocessingML package in an uncompressed ZIP (no dependencies) ---
function zip(files: Record<string, string>): Buffer {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content, "utf8");
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, data);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(data.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const cenBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cenBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cenBuf, end]);
}

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function docx(text: string): Buffer {
  const paras = text
    .split("\n")
    .map((line, i) => {
      const heading = i === 0 || isHeading(line);
      const run = heading ? `<w:rPr><w:b/></w:rPr>` : "";
      return `<w:p>${heading ? '<w:pPr><w:jc w:val="center"/></w:pPr>' : ""}<w:r>${run}<w:t xml:space="preserve">${xml(line)}</w:t></w:r></w:p>`;
    })
    .join("");
  return zip({
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
  });
}

// --- PDF: a plain, court-style typed document, printed by Chromium ---
const fontData = (file: string) => readFileSync(`public/fonts/${file}`).toString("base64");
const css = `
@font-face { font-family: Deva; src: url(data:font/ttf;base64,${fontData("NotoSansDevanagari-Regular.ttf")}); }
@font-face { font-family: Deva; font-weight: 700; src: url(data:font/ttf;base64,${fontData("NotoSansDevanagari-Bold.ttf")}); }
@page { size: A4; margin: 22mm 22mm 24mm; }
body { font: 11.5pt/1.6 "Times New Roman", Deva, serif; color: #111; }
p { margin: 0 0 6pt; white-space: pre-wrap; }
.h { font-weight: 700; text-align: center; margin: 6pt 0; }
.title { font-weight: 700; text-align: center; font-size: 13pt; }
footer { position: fixed; bottom: -14mm; left: 0; right: 0; text-align: center; font: 8pt Arial, Deva, sans-serif; color: #777; }`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = (text: string) => {
  const [first, ...rest] = text.split("\n");
  const body = rest.map((line) => (line.trim() === "" ? "<p>&nbsp;</p>" : `<p class="${isHeading(line) ? "h" : ""}">${esc(line)}</p>`)).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><p class="title">${esc(first!)}</p>${body}<footer>Fictional sample case for LexAgent · not a real court record</footer></body></html>`;
};

mkdirSync("sample-cases", { recursive: true });
mkdirSync("src/lib/__fixtures__", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
// A4 at 96 css px per inch; device scale 2 gives about 190 dpi, a typical court-copy scan.
const scanPage = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });

/** A "scanned" PDF: each page is a slightly tilted, off-white JPEG image with no text layer, like a court copy. */
async function scannedPdf(slug: string, text: string) {
  await scanPage.setContent(html(text).replace("<body>", '<body style="margin:0;padding:84px 84px 96px;background:#fbfaf5">'), { waitUntil: "load" });
  const height = await scanPage.evaluate(() => document.documentElement.scrollHeight);
  const pages = Math.max(1, Math.ceil((height - 140) / 1123)); // ignore spill-over of the bottom padding
  const images: string[] = [];
  for (let i = 0; i < pages; i++) {
    const jpg = await scanPage.screenshot({ type: "jpeg", quality: 82, clip: { x: 0, y: i * 1123, width: 794, height: 1123 }, fullPage: true });
    writeFileSync(`src/lib/__fixtures__/${slug}-p${i + 1}.jpg`, jpg);
    images.push(jpg.toString("base64"));
  }
  const doc = `<!doctype html><html><head><style>@page{size:A4;margin:0}body{margin:0}div{width:210mm;height:297mm;overflow:hidden;page-break-after:always;background:#f3f1ea}img{width:100%;transform:rotate(-0.35deg);transform-origin:center}</style></head><body>${images.map((b) => `<div><img src="data:image/jpeg;base64,${b}"></div>`).join("")}</body></html>`;
  await page.setContent(doc, { waitUntil: "load" });
  await page.pdf({ path: `sample-cases/${slug}.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
}

for (const sample of SAMPLES) {
  const { slug, text } = sample;
  writeFileSync(`sample-cases/${slug}.txt`, text + "\n");
  writeFileSync(`sample-cases/${slug}.docx`, docx(text));
  if (/[ऀ-ॿ]/.test(text)) {
    // Hindi/Marathi: ship a scanned PDF, read by LexAgent's OCR (a text PDF's Devanagari layer would extract garbled).
    await scannedPdf(slug, text);
    console.log("wrote", slug, "(scanned pdf, docx, txt)");
    continue;
  }
  await page.setContent(html(text), { waitUntil: "load" });
  await page.pdf({ path: `sample-cases/${slug}.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log("wrote", slug);
}
await browser.close();
