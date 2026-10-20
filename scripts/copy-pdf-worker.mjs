// Copy the pdf.js worker into public/ so the browser can load it from our own origin (CSP: 'self').
import { copyFileSync, existsSync } from "node:fs";

const src = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
if (existsSync(src)) copyFileSync(src, "public/pdf.worker.min.mjs");
