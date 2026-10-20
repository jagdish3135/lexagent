import type { ChatJson } from "./llm";
import { SAMPLES } from "./samples";

/**
 * Demo mode (no API key): a fake chat function that returns the stored analysis of the matching sample case,
 * so the real pipeline, streaming and UI all run. Any other text gets the first sample's analysis,
 * and the UI says plainly that it is a demo.
 */
export function demoChat(caseText: string, delayMs = 1200): { chat: ChatJson; matched: boolean } {
  const sample = SAMPLES.find((s) => s.text.trim() === caseText.trim());
  const { demo } = sample ?? SAMPLES[0]!;
  const chat: ChatJson = async (system) => {
    await new Promise((r) => setTimeout(r, delayMs * (0.8 + Math.random() * 0.6)));
    if (system.includes("Your role: Summarizer")) return demo.summarizer;
    if (system.includes("Your role: Legal Analyst")) return demo.analyst;
    if (system.includes("Your role: Cross-Verifier")) return demo.verifier;
    return demo.chief;
  };
  return { chat, matched: Boolean(sample) };
}
