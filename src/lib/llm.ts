// Minimal client for any OpenAI-compatible chat API (Mistral, Groq, Gemini, OpenRouter...). Server-only.
export interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export type ChatJson = (system: string, user: string) => Promise<unknown>;

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): LlmConfig | null {
  const apiKey = env.LLM_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: (env.LLM_BASE_URL?.trim() || "https://api.mistral.ai/v1").replace(/\/+$/, ""),
    model: env.LLM_MODEL?.trim() || "mistral-small-latest",
  };
}

/** Pull a JSON object out of a model reply, tolerating ```json fences or text around it. */
export function parseJsonReply(reply: string): unknown {
  const cleaned = reply.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("The AI reply was not valid JSON");
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createChatJson(cfg: LlmConfig, fetchImpl: typeof fetch = fetch, retries = 3): ChatJson {
  return async (system, user) => {
    for (let attempt = 0; ; attempt++) {
      const res = await fetchImpl(`${cfg.baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
        body: JSON.stringify({
          model: cfg.model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        signal: AbortSignal.timeout(90_000),
      });

      // A plan with zero quota (e.g. Mistral's free plan not activated yet) will never succeed: don't retry.
      if (res.status === 429 && res.headers.get("x-ratelimit-limit-req-minute") === "0") {
        throw new Error("This AI key has no quota yet. Activate the free plan in your AI provider's console, then try again");
      }
      // Free tiers rate-limit hard (Mistral: about 1 request/second). Back off and try again.
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        const retryAfter = Number(res.headers.get("retry-after"));
        await sleep(retryAfter > 0 ? Math.min(retryAfter, 20) * 1000 : 1500 * 2 ** attempt);
        continue;
      }
      if (!res.ok) {
        // Never echo the provider's body: it can contain request details. Status is enough to debug.
        throw new Error(
          res.status === 401 || res.status === 403
            ? "The AI provider rejected the API key"
            : res.status === 429
              ? "The free AI tier is busy. Please try again in a minute"
              : `The AI provider returned an error (${res.status})`,
        );
      }

      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("The AI provider returned an empty reply");
      return parseJsonReply(content);
    }
  };
}
