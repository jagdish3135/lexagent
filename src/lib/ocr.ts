"use client";
import type { PDFDocumentProxy } from "pdfjs-dist";

// OCR for PDFs without usable text: scanned court copies, and Hindi/Marathi PDFs whose text layer is broken.
// Runs fully in the browser with tesseract.js; the engine and language models are served from our own origin.
export const OCR_LANGS = ["mar", "hin", "eng"];
export const OCR_MAX_PAGES = 30;

export interface OcrProgress {
  page: number;
  total: number;
}

export async function ocrPdf(doc: PDFDocumentProxy, onProgress?: (p: OcrProgress) => void): Promise<string> {
  const { createWorker, OEM } = await import("tesseract.js");
  const origin = window.location.origin;
  const worker = await createWorker(OCR_LANGS, OEM.LSTM_ONLY, {
    workerPath: `${origin}/ocr/worker.min.js`,
    corePath: `${origin}/ocr/core`,
    langPath: `${origin}/ocr/lang`,
    gzip: true,
  });
  try {
    const total = Math.min(doc.numPages, OCR_MAX_PAGES);
    const pages: string[] = [];
    for (let n = 1; n <= total; n++) {
      onProgress?.({ page: n, total });
      const page = await doc.getPage(n);
      // About 200 dpi: sharp enough for court typefaces without making OCR slow.
      const viewport = page.getViewport({ scale: 2.8 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      const { data } = await worker.recognize(canvas);
      pages.push(data.text);
      page.cleanup();
    }
    return pages.join("\n\n");
  } finally {
    await worker.terminate();
  }
}
