"use client";

// Text extraction runs in the browser, so case files are never uploaded as files: only their text is sent.
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

/** `code` is a translation key for the message shown to the user. */
export class ExtractError extends Error {
  constructor(public code: "err.tooBig" | "err.doc" | "err.type" | "err.scanned" | "err.emptyFile") {
    super(code);
  }
}

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.size > MAX_FILE_BYTES) throw new ExtractError("err.tooBig");

  let text: string;
  if (name.endsWith(".txt")) {
    text = await file.text();
  } else if (name.endsWith(".pdf")) {
    text = await pdfText(await file.arrayBuffer());
  } else if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  } else if (name.endsWith(".doc")) {
    throw new ExtractError("err.doc");
  } else {
    throw new ExtractError("err.type");
  }

  const clean = text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!clean) {
    throw new ExtractError(name.endsWith(".pdf") ? "err.scanned" : "err.emptyFile");
  }
  return clean;
}

async function pdfText(data: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({ data });
  const doc = await task.promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(
      content.items
        .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : " ") : ""))
        .join("")
        .replace(/ +/g, " "),
    );
  }
  await task.destroy();
  return pages.join("\n\n");
}
