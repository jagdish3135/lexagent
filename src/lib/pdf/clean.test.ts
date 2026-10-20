import { describe, expect, it } from "vitest";
import { cleanDeep, pdfSafe } from "./clean";

describe("pdfSafe", () => {
  it("maps rupee and arrows, keeps WinAnsi punctuation, drops unsupported scripts", () => {
    expect(pdfSafe("₹4,50,000 → paid")).toBe("Rs. 4,50,000 -> paid");
    expect(pdfSafe("“quoted” – dash • bullet")).toBe("“quoted” – dash • bullet");
    expect(pdfSafe("Court न्यायालय ok")).toBe("Court ok");
  });
  it("cleans nested objects without changing their shape", () => {
    expect(cleanDeep({ a: ["₹1"], b: { c: "✓ done" }, n: 3 })).toEqual({ a: ["Rs. 1"], b: { c: " done" }, n: 3 });
  });
});
