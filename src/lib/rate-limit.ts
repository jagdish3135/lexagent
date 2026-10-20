// Best-effort, in-memory limit per IP. On serverless each instance has its own memory, which is fine
// for protecting a free API quota from casual abuse; it is not a security boundary.
const hits = new Map<string, number[]>();

export function allow(key: string, limit = 6, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}
