import { runPipeline } from "@/lib/agents";
import { demoChat } from "@/lib/demo";
import { configFromEnv, createChatJson } from "@/lib/llm";
import { allow } from "@/lib/rate-limit";
import type { StreamEvent } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 300;

const MIN_CHARS = 200;

function maxChars() {
  const n = Number(process.env.MAX_INPUT_CHARS);
  return Number.isFinite(n) && n >= 1000 ? n : 40_000;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, "Send JSON like {\"text\": \"...\"}");
  }
  const raw = typeof (body as { text?: unknown })?.text === "string" ? (body as { text: string }).text : "";
  const text = raw.replace(/\u0000/g, "").trim();
  if (text.length < MIN_CHARS) {
    return json(400, `The case text is too short. Add at least ${MIN_CHARS} characters so the agents have something to read.`);
  }
  if (text.length > 400_000) return json(413, "This document is too large. Please upload a file under 400,000 characters.");

  const cfg = configFromEnv();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (cfg && !allow(ip)) return json(429, "Too many analyses in a short time. Please wait a few minutes and try again.");

  const limit = maxChars();
  const truncated = text.length > limit;
  const caseText = truncated ? text.slice(0, limit) : text;
  const chat = cfg ? createChatJson(cfg) : demoChat(caseText, Number(process.env.DEMO_DELAY_MS ?? 1200)).chat;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;
      const emit = (e: StreamEvent) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
        } catch {
          open = false; // The client went away; let the pipeline finish quietly.
        }
      };
      emit({ type: "meta", mode: cfg ? "live" : "demo", model: cfg?.model ?? "demo", truncated, chars: caseText.length });
      try {
        await runPipeline(caseText, chat, emit);
        emit({ type: "end" });
      } catch {
        emit({ type: "error", error: "The analysis stopped unexpectedly. Please try again." });
      }
      if (open) controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
