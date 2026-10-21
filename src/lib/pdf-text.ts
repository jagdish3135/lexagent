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
 * True when Devanagari text from a PDF looks broken. PDFs without a proper text mapping (common for Hindi and
 * Marathi) lose characters in recognisable ways, so any one of these signs is enough:
 * - many "words" that start with a vowel sign or are a lone letter (clusters split apart);
 * - the vowel sign ि (U+093F) is missing: it is 2-5% of normal Hindi/Marathi text, but its reordered glyph often
 *   has no mapping, so it vanishes ("दवाणी" for "दिवाणी");
 * - conjuncts split at the virama ("न् यायाधीश"), which almost never happens in real text.
 */
export function looksDamagedDevanagari(text: string): boolean {
  const t = text.normalize("NFC");
  const words = t.match(/[ऀ-ॿ]+/g) ?? [];
  if (words.length < 20) return false;
  const letters = (t.match(/[ऀ-ॿ]/g) ?? []).length;
  const broken = words.filter((w) => /^[ा-्॑-ॗॢॣ]/.test(w) || [...w].length === 1).length;
  const iSigns = (t.match(/ि/g) ?? []).length;
  const splitConjuncts = (t.match(/्(?=\s)/g) ?? []).length;
  return broken / words.length > 0.3 || (letters >= 300 && iSigns / letters < 0.006) || splitConjuncts / words.length > 0.04;
}
