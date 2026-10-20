// Shared by the browser and the API route (no "use client"), so both agree on what is allowed.
export const LANGS = [
  { id: "en", label: "English", short: "EN", name: "English" },
  { id: "hi", label: "हिन्दी", short: "हि", name: "Hindi" },
  { id: "mr", label: "मराठी", short: "म", name: "Marathi" },
] as const;
export type Lang = (typeof LANGS)[number]["id"];

export const ROLES = ["citizen", "student", "advocate", "judge", "researcher"] as const;
export type Role = (typeof ROLES)[number];

export const isLang = (v: unknown): v is Lang => LANGS.some((l) => l.id === v);
export const isRole = (v: unknown): v is Role => (ROLES as readonly unknown[]).includes(v);
