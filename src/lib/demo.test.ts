import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { matchSample } from "./demo";
import { joinTextItems, looksDamagedDevanagari } from "./pdf-text";
import { SAMPLES, sampleFormats } from "./samples";

// Same libraries and joining the browser uses for uploads (extract.ts), run in Node.
async function pdfText(path: string) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(path)), verbosity: 0 }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    out += joinTextItems(content.items.filter((it) => "str" in it)) + "\n";
  }
  return out;
}

async function docxText(path: string) {
  const mammoth = await import("mammoth");
  return (await mammoth.extractRawText({ path })).value;
}

describe("demo mode matches uploaded sample files to the right case", () => {
  for (const sample of SAMPLES) {
    const formats = sampleFormats(sample);
    it(`${sample.slug} (${formats.join(", ")})`, async () => {
      const base = `sample-cases/${sample.slug}`;
      expect(matchSample(readFileSync(`${base}.txt`, "utf8"))?.id).toBe(sample.id);
      expect(matchSample(await docxText(`${base}.docx`))?.id).toBe(sample.id);
      if (formats.includes("pdf")) expect(matchSample(await pdfText(`${base}.pdf`))?.id).toBe(sample.id);
    });
  }

  it("flags broken Devanagari PDF text but not clean text", () => {
    const clean = SAMPLES.find((s) => s.id === "farmroad")!.text;
    const broken =
      "्र . 214/2025 ( प्र ा त् य का सा ठ का ल् प न क न मु ना प्र करण ) ी . रा म चं द्र द ा त्र य जा धव , वय 58, धं दा शे ती , रा . व डू ज , त ा. ख टा व ि ज. सा ता रा ... वा दी ि व रु द्ध श्री . सु रे श";
    expect(looksDamagedDevanagari(clean)).toBe(false);
    expect(looksDamagedDevanagari(broken)).toBe(true);
  });

  it("does not match a document that is not a sample", () => {
    const other =
      "IN THE HIGH COURT OF BOMBAY. Writ Petition No. 77 of 2025. The petitioner challenges an order of the Collector cancelling his liquor licence without a hearing, and seeks quashing of the order under Article 226 of the Constitution of India.";
    expect(matchSample(other)).toBeUndefined();
  });
});
