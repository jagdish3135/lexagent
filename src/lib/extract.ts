"use client";
import type { OcrProgress } from "./ocr";
import { joinTextItems, looksDamagedDevanagari } from "./pdf-text";

// Text extraction runs in the browser, so case files are never uploaded as files: only their text is sent.
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

/** `code` is a translation key for the message shown to the user. */
export class ExtractError extends Error {
  constructor(public code: "err.tooBig" | "err.doc" | "err.type" | "err.scanned" | "err.emptyFile" | "err.damaged") {
    super(code);
  }
}

export interface Extracted {
  text: string;
  /** True when the text came from OCR (a scan, or a PDF with a broken text layer): worth checking before analysis. */
  ocr: boolean;
}

const tidy = (text: string) => text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/ {2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();

export async function extractText(file: File, onOcrProgress?: (p: OcrProgress) => void): Promise<Extracted> {
  const name = file.name.toLowerCase();
  if (file.size > MAX_FILE_BYTES) throw new ExtractError("err.tooBig");

  if (name.endsWith(".pdf")) return readPdf(await file.arrayBuffer(), onOcrProgress);

  let text: string;
  if (name.endsWith(".txt")) {
    text = await file.text();
  } else if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  } else if (name.endsWith(".doc")) {
    throw new ExtractError("err.doc");
  } else {
    throw new ExtractError("err.type");
  }
  const clean = tidy(text);
  if (!clean) throw new ExtractError("err.emptyFile");
  return { text: clean, ocr: false };
}

async function readPdf(data: ArrayBuffer, onOcrProgress?: (p: OcrProgress) => void): Promise<Extracted> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({ data });
  const doc = await task.promise;
  try {
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const content = await (await doc.getPage(i)).getTextContent();
      pages.push(joinTextItems(content.items.filter((item) => "str" in item)));
    }
    const text = tidy(pages.join("\n\n"));
    if (text && !looksDamagedDevanagari(text)) return { text, ocr: false };

    // No text (a scan) or a broken Devanagari text layer: read the page images with OCR instead.
    let ocrText = "";
    try {
      const { ocrPdf } = await import("./ocr");
      ocrText = tidy(await ocrPdf(doc, onOcrProgress));
    } catch {
      // OCR engine failed to load or run: fall through to the clear error below.
    }
    if (ocrText) return { text: ocrText, ocr: true };
    throw new ExtractError(text ? "err.damaged" : "err.scanned");
  } finally {
    await task.destroy();
  }
}
