import { pdf } from "@react-pdf/renderer";
import type { AgentOutputs } from "../schemas";
import { cleanDeep } from "./clean";
import { ReportDoc, type ReportInfo } from "./report";

// Loaded on demand when the user clicks "Export PDF", so the PDF engine is not in the dashboard bundle.
export async function downloadReport(outputs: AgentOutputs, info: ReportInfo) {
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const blob = await pdf(ReportDoc({ outputs: cleanDeep(outputs), info: cleanDeep(info), date })).toBlob();
  const name = (outputs.summarizer?.title || "case-analysis").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LexAgent-${name || "report"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
