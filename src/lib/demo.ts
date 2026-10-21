import type { ChatJson } from "./llm";
import { SAMPLES, type SampleCase } from "./samples";

// Words of a text, in any script. Marks (\p{M}) are kept so Devanagari vowel signs stay inside their words.
const words = (text: string) => new Set(text.normalize("NFC").toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? []);

/**
 * Finds the sample case a text came from, even when it was uploaded as a PDF or DOCX and the line breaks
 * and spacing differ from the original: compares word sets (Jaccard similarity).
 */
export function matchSample(text: string, threshold = 0.8): SampleCase | undefined {
  const a = words(text);
  if (a.size === 0) return undefined;
  let best: { sample: SampleCase; score: number } | undefined;
  for (const sample of SAMPLES) {
    const b = words(sample.text);
    let shared = 0;
    for (const w of a) if (b.has(w)) shared++;
    const score = shared / (a.size + b.size - shared);
    if (!best || score > best.score) best = { sample, score };
  }
  return best && best.score >= threshold ? best.sample : undefined;
}

/**
 * Demo mode (no API key): returns the stored analysis of a sample case so the real pipeline, streaming and UI
 * all run. It never answers for other documents; the API refuses those instead of showing another case.
 */
export function demoChat(sample: SampleCase, delayMs = 1200): ChatJson {
  const { demo } = sample;
  return async (system) => {
    await new Promise((r) => setTimeout(r, delayMs * (0.8 + Math.random() * 0.6)));
    if (system.includes("Your role: Summarizer")) return demo.summarizer;
    if (system.includes("Your role: Legal Analyst")) return demo.analyst;
    if (system.includes("Your role: Cross-Verifier")) return demo.verifier;
    return demo.chief;
  };
}
