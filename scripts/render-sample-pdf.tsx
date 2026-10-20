// Dev helper: render the demo report for a sample case to a PDF file (used for the README preview).
// Usage: npx tsx scripts/render-sample-pdf.tsx <sampleId> <out.pdf> [en|hi|mr] [outputs.json]
// The optional JSON replaces the stored English demo analysis (e.g. a translated one for a Hindi preview).
import { readFileSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { cleanDeep } from "../src/lib/pdf/clean";
import { ReportDoc, registerFonts } from "../src/lib/pdf/report";
import { isLang } from "../src/lib/locale";
import { SAMPLES } from "../src/lib/samples";

const [id = "cheque", out = "report.pdf", langArg = "en", json] = process.argv.slice(2);
const lang = isLang(langArg) ? langArg : "en";
registerFonts("public/fonts");
const sample = SAMPLES.find((s) => s.id === id) ?? SAMPLES[0]!;
const outputs = json ? JSON.parse(readFileSync(json, "utf8")) : sample.demo;
await renderToFile(
  ReportDoc({ outputs: lang === "en" ? cleanDeep(outputs) : outputs, info: { mode: "demo", model: "demo", source: `Sample: ${sample.label}`, lang }, date: "20 Oct 2026" }),
  out,
);
console.log("wrote", out);
