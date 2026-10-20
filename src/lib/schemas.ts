import { z } from "zod";

// Each agent returns JSON. The schemas are forgiving: a missing or malformed field becomes an empty value
// instead of failing the whole analysis, because small free models are not always exact.
const text = z.string().catch("");
const list = z.array(z.string()).catch([]);

export const summarySchema = z.object({
  title: text,
  caseType: text,
  court: text,
  plainSummary: list,
  parties: z.array(z.object({ name: text, role: text })).catch([]),
  timeline: z.array(z.object({ date: text, event: text })).catch([]),
});

export const insightsSchema = z.object({
  keyFacts: list,
  issues: list,
  arguments: z.array(z.object({ side: text, points: list })).catch([]),
  laws: z.array(z.object({ law: text, section: text, relevance: text })).catch([]),
});

export const comparisonSchema = z.object({
  agreements: list,
  differences: list,
  inconsistencies: list,
  confidence: z.enum(["High", "Medium", "Low"]).catch("Medium"),
  confidenceNote: text,
});

export const finalSchema = z.object({
  overview: text,
  keyFindings: list,
  sides: z.array(z.object({ side: text, strengths: list, weaknesses: list })).catch([]),
  openQuestions: list,
  nextSteps: list,
});

export type Summary = z.infer<typeof summarySchema>;
export type Insights = z.infer<typeof insightsSchema>;
export type Comparison = z.infer<typeof comparisonSchema>;
export type Final = z.infer<typeof finalSchema>;

export type AgentId = "summarizer" | "analyst" | "verifier" | "chief";
export type AgentStatus = "waiting" | "working" | "done" | "failed" | "skipped";

export interface AgentOutputs {
  summarizer?: Summary;
  analyst?: Insights;
  verifier?: Comparison;
  chief?: Final;
}

// One line of the NDJSON stream from /api/analyze.
export type StreamEvent =
  | { type: "meta"; mode: "live" | "demo"; model: string; truncated: boolean; chars: number }
  | { type: "status"; agent: AgentId; status: AgentStatus; output?: unknown; error?: string }
  | { type: "end" }
  | { type: "error"; error: string };

export const AGENTS: { id: AgentId; name: string; role: string; section: string; color: string }[] = [
  { id: "summarizer", name: "Summarizer", role: "Explains the case in plain language", section: "Summary", color: "blue" },
  { id: "analyst", name: "Legal Analyst", role: "Finds facts, arguments and Indian laws", section: "Legal Insights", color: "amber" },
  { id: "verifier", name: "Cross-Verifier", role: "Compares both readings for gaps", section: "Comparison", color: "green" },
  { id: "chief", name: "Chief Analyst", role: "Writes the final structured analysis", section: "Final Analysis", color: "red" },
];
