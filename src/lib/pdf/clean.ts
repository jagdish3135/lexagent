// The PDF uses the built-in Helvetica/Times fonts, which only cover the WinAnsi character set.
// Map common symbols to safe text and drop anything else, so no character renders as garbage.
const MAP: [RegExp, string][] = [
  [/₹\s?/g, "Rs. "],
  [/[→⇒]/g, "->"],
  [/≠/g, "!="],
  [/[✓✔]/g, ""],
  [/§/g, "Section "],
];
const UNSUPPORTED = /[^\t\n\r\x20-\x7E\xA0-\xFF‘’“”–—•…€™]/g;

export function pdfSafe(text: string): string {
  let out = text;
  for (const [re, to] of MAP) out = out.replace(re, to);
  return out.replace(UNSUPPORTED, "").replace(/ {2,}/g, " ");
}

export function cleanDeep<T>(value: T): T {
  if (typeof value === "string") return pdfSafe(value) as T;
  if (Array.isArray(value)) return value.map(cleanDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanDeep(v)])) as T;
  }
  return value;
}
