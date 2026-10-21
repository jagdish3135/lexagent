import { describe, expect, it } from "vitest";
import { matchSample } from "./demo";
import { looksDamagedDevanagari } from "./pdf-text";
import { SAMPLES } from "./samples";

// The same OCR engine and models the browser uses (copied to public/ocr by scripts/postinstall.mjs),
// run on page images of the scanned Hindi/Marathi sample PDFs.
describe("OCR of scanned Hindi/Marathi pages", () => {
  for (const slug of ["06-farm-road-injunction-marathi", "07-maintenance-hindi"]) {
    it(`reads ${slug} well enough to recognise the case`, { timeout: 180_000 }, async () => {
      const { createWorker, OEM } = await import("tesseract.js");
      const worker = await createWorker(["mar", "hin", "eng"], OEM.LSTM_ONLY, { langPath: "public/ocr/lang", gzip: true });
      try {
        const { data } = await worker.recognize(`src/lib/__fixtures__/${slug}-p1.jpg`);
        const sample = SAMPLES.find((s) => s.slug === slug)!;
        expect(data.text.length).toBeGreaterThan(800);
        expect(looksDamagedDevanagari(data.text)).toBe(false);
        expect(matchSample(data.text)?.id).toBe(sample.id);
      } finally {
        await worker.terminate();
      }
    });
  }
});
