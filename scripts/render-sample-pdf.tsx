// Dev helper: render the demo report for a sample case to a PDF file (used for the README preview).
// Usage: npx tsx scripts/render-sample-pdf.tsx <sampleId> <out.pdf>
import { renderToFile } from "@react-pdf/renderer";
import { cleanDeep } from "../src/lib/pdf/clean";
import { ReportDoc } from "../src/lib/pdf/report";
import { SAMPLES } from "../src/lib/samples";

const [id = "cheque", out = "report.pdf"] = process.argv.slice(2);
const sample = SAMPLES.find((s) => s.id === id) ?? SAMPLES[0]!;
await renderToFile(
  ReportDoc({ outputs: cleanDeep(sample.demo), info: { mode: "demo", model: "demo", source: `Sample: ${sample.label}` }, date: "20 Oct 2026" }),
  out,
);
console.log("wrote", out);
