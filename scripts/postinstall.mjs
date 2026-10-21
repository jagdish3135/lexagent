// Copies files the browser must load from our own origin (CSP: 'self') into public/:
// the pdf.js worker, the Devanagari font for Hindi/Marathi PDFs, the OCR engine and language data, and the
// sample case files.
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";

const copy = (from, to) => existsSync(from) && copyFileSync(from, to);

copy("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "public/pdf.worker.min.mjs");

mkdirSync("public/fonts", { recursive: true });
const font = "node_modules/@expo-google-fonts/noto-sans-devanagari";
copy(`${font}/400Regular/NotoSansDevanagari_400Regular.ttf`, "public/fonts/NotoSansDevanagari-Regular.ttf");
copy(`${font}/700Bold/NotoSansDevanagari_700Bold.ttf`, "public/fonts/NotoSansDevanagari-Bold.ttf");

// OCR (tesseract.js): worker, LSTM wasm builds (plain, SIMD, relaxed SIMD) and English/Hindi/Marathi models.
mkdirSync("public/ocr/core", { recursive: true });
mkdirSync("public/ocr/lang", { recursive: true });
copy("node_modules/tesseract.js/dist/worker.min.js", "public/ocr/worker.min.js");
for (const core of ["tesseract-core-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js", "tesseract-core-relaxedsimd-lstm.wasm.js"]) {
  copy(`node_modules/tesseract.js-core/${core}`, `public/ocr/core/${core}`);
}
for (const lang of ["eng", "hin", "mar"]) {
  copy(`node_modules/@tesseract.js-data/${lang}/4.0.0_best_int/${lang}.traineddata.gz`, `public/ocr/lang/${lang}.traineddata.gz`);
}

if (existsSync("sample-cases")) cpSync("sample-cases", "public/sample-cases", { recursive: true });
