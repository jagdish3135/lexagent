// Pure helpers for turning pdf.js text items into readable text. Shared by the browser upload and the tests.

interface Item {
  str: string;
  hasEOL?: boolean;
  transform: number[]; // [a, b, c, d, x, y]
  width: number;
  height: number;
}

/**
 * Joins text items using their positions: a space only where there is a visible gap, a newline where the line
 * changes. Adding a space after every item splits words in scripts like Devanagari, where items are single clusters.
 */
export function joinTextItems(items: Item[]): string {
  let out = "";
  let prev: Item | undefined;
  for (const item of items) {
    if (!item.str) {
      if (item.hasEOL) out += "\n";
      continue;
    }
    if (prev) {
      const size = Math.max(item.height || 0, prev.height || 0, 1);
      const sameLine = Math.abs(item.transform[5]! - prev.transform[5]!) < size * 0.5;
      if (!sameLine) {
        if (!out.endsWith("\n")) out += "\n";
      } else {
        const gap = item.transform[4]! - (prev.transform[4]! + prev.width);
        if (gap > size * 0.18 && !out.endsWith(" ") && !item.str.startsWith(" ")) out += " ";
      }
    }
    out += item.str;
    if (item.hasEOL) out += "\n";
    prev = item;
  }
  return out;
}

/**
 * True when Devanagari text from a PDF looks broken: many "words" that start with a vowel sign or are a lone
 * letter, which happens when the PDF has no proper text mapping (common with Hindi and Marathi PDFs).
 */
export function looksDamagedDevanagari(text: string): boolean {
  const words = text.normalize("NFC").match(/[ऀ-ॿ]+/g) ?? [];
  if (words.length < 20) return false;
  const broken = words.filter((w) => /^[ा-्॑-ॗॢॣ]/.test(w) || [...w].length === 1).length;
  return broken / words.length > 0.3;
}
