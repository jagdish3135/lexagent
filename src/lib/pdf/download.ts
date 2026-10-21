import { pdf } from "@react-pdf/renderer";
import type { AgentOutputs } from "../schemas";
import { cleanDeep } from "./clean";
import { ReportDoc, needsDevanagari, registerFonts, type ReportInfo } from "./report";

// Loaded on demand when the user clicks "Export PDF", so the PDF engine is not in the dashboard bundle.
export async function downloadReport(outputs: AgentOutputs, info: ReportInfo) {
  registerFonts("/fonts");
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  // The built-in fonts used for English only cover WinAnsi; the Devanagari font covers everything.
  const deva = needsDevanagari(outputs, info.lang);
  const blob = await pdf(ReportDoc({ outputs: deva ? outputs : cleanDeep(outputs), info: deva ? info : cleanDeep(info), date })).toBlob();
  const name = (outputs.summarizer?.title || "case-analysis").replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LexAgent-${name || "report"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
