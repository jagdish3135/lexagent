// Copies files the browser must load from our own origin (CSP: 'self') into public/:
// the pdf.js worker, the Devanagari font for Hindi/Marathi PDFs, and the sample case files.
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";

const copy = (from, to) => existsSync(from) && copyFileSync(from, to);

copy("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "public/pdf.worker.min.mjs");
mkdirSync("public/fonts", { recursive: true });
const font = "node_modules/@expo-google-fonts/noto-sans-devanagari";
copy(`${font}/400Regular/NotoSansDevanagari_400Regular.ttf`, "public/fonts/NotoSansDevanagari-Regular.ttf");
copy(`${font}/700Bold/NotoSansDevanagari_700Bold.ttf`, "public/fonts/NotoSansDevanagari-Bold.ttf");
if (existsSync("sample-cases")) cpSync("sample-cases", "public/sample-cases", { recursive: true });
