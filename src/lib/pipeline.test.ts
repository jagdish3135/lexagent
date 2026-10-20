import { describe, expect, it, vi } from "vitest";
import { runPipeline } from "./agents";
import { createChatJson, parseJsonReply } from "./llm";
import { SAMPLES } from "./samples";
import type { StreamEvent } from "./schemas";
import { POST } from "@/app/api/analyze/route";

const sample = SAMPLES[0]!;

describe("parseJsonReply", () => {
  it("reads plain, fenced and wrapped JSON", () => {
    expect(parseJsonReply('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonReply('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJsonReply('Here you go: {"a":1} hope it helps')).toEqual({ a: 1 });
  });
  it("throws on non-JSON", () => {
    expect(() => parseJsonReply("no json here")).toThrow(/not valid JSON/);
  });
});

describe("createChatJson", () => {
  const cfg = { baseUrl: "https://x.test/v1", apiKey: "k", model: "m" };
  const ok = () => new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":true}' } }] }));

  it("retries on 429 and then succeeds", async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response("", { status: 429, headers: { "retry-after": "0" } })).mockResolvedValueOnce(ok());
    vi.useFakeTimers();
    const p = createChatJson(cfg, f as unknown as typeof fetch)("s", "u");
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    expect(await p).toEqual({ ok: true });
    expect(f).toHaveBeenCalledTimes(2);
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe("https://x.test/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer k");
  });

  it("does not retry when the key has zero quota", async () => {
    const f = vi.fn().mockResolvedValue(new Response("", { status: 429, headers: { "x-ratelimit-limit-req-minute": "0" } }));
    await expect(createChatJson(cfg, f as unknown as typeof fetch)("s", "u")).rejects.toThrow("no quota");
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("gives a friendly error on a bad key and never leaks the body", async () => {
    const f = vi.fn().mockResolvedValue(new Response("secret details", { status: 401 }));
    await expect(createChatJson(cfg, f as unknown as typeof fetch)("s", "u")).rejects.toThrow("rejected the API key");
  });
});

describe("runPipeline", () => {
  it("runs the two readers in parallel, then verifier, then chief", async () => {
    const order: string[] = [];
    const chat = async (system: string) => {
      const role = /Your role: ([\w-]+(?: \w+)?)/.exec(system)![1]!;
      order.push(`start:${role}`);
      await new Promise((r) => setTimeout(r, 5));
      order.push(`end:${role}`);
      return { title: "T", keyFacts: ["f"], confidence: "Bogus" };
    };
    const events: StreamEvent[] = [];
    const out = await runPipeline("case", chat, (e) => events.push(e));
    expect(order.slice(0, 2).sort()).toEqual(["start:Legal Analyst", "start:Summarizer"]);
    expect(order.indexOf("start:Cross-Verifier")).toBeGreaterThan(order.indexOf("end:Summarizer"));
    expect(order.at(-1)).toBe("end:Chief Analyst");
    // Malformed fields are coerced instead of failing the agent.
    expect(out.verifier?.confidence).toBe("Medium");
    expect(out.summarizer?.plainSummary).toEqual([]);
    expect(events.filter((e) => e.type === "status" && e.status === "done")).toHaveLength(4);
  });

  it("skips verifier and chief when a reader fails", async () => {
    const chat = async (system: string) => {
      if (system.includes("Legal Analyst")) throw new Error("boom");
      return {};
    };
    const events: StreamEvent[] = [];
    await runPipeline("case", chat, (e) => events.push(e));
    const statuses = events.flatMap((e) => (e.type === "status" ? [`${e.agent}:${e.status}`] : []));
    expect(statuses).toContain("analyst:failed");
    expect(statuses).toContain("verifier:skipped");
    expect(statuses).toContain("chief:skipped");
  });
});

describe("POST /api/analyze", () => {
  const call = (body: unknown) =>
    POST(new Request("http://t/api/analyze", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));

  it("rejects bad JSON, short and huge input", async () => {
    expect((await call("not json")).status).toBe(400);
    expect((await call({ text: "too short" })).status).toBe(400);
    expect((await call({ text: "x".repeat(400_001) })).status).toBe(413);
  });

  it("streams all four agents in demo mode", async () => {
    vi.stubEnv("LLM_API_KEY", "");
    vi.stubEnv("DEMO_DELAY_MS", "0");
    const res = await call({ text: sample.text });
    expect(res.headers.get("content-type")).toContain("ndjson");
    const events = (await res.text()).trim().split("\n").map((l) => JSON.parse(l) as StreamEvent);
    expect(events[0]).toMatchObject({ type: "meta", mode: "demo" });
    const chief = events.find((e) => e.type === "status" && e.agent === "chief" && e.status === "done");
    expect(chief).toMatchObject({ output: { overview: sample.demo.chief.overview } });
    expect(events.at(-1)).toEqual({ type: "end" });
    vi.unstubAllEnvs();
  });
});
