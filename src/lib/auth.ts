"use client";
import { readKey, useStoredKey, writeKey } from "./client-store";

// DEMO AUTH ONLY. Accounts live in this browser's localStorage; nothing is sent to a server.
// Replace with a real auth provider before storing anything sensitive.
const USERS = "lexagent.users";
const SESSION = "lexagent.session";

export interface Session {
  name: string;
  email: string;
}

interface StoredUser extends Session {
  hash: string;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function hash(email: string, password: string) {
  const bytes = new TextEncoder().encode(`lexagent:${email}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function users(): StoredUser[] {
  try {
    return JSON.parse(readKey(USERS) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

export async function signUp(name: string, email: string, password: string): Promise<string | null> {
  const e = email.trim().toLowerCase();
  const all = users();
  if (all.some((u) => u.email === e)) return "An account with this email already exists. Log in instead.";
  all.push({ name: name.trim(), email: e, hash: await hash(e, password) });
  writeKey(USERS, JSON.stringify(all));
  writeKey(SESSION, JSON.stringify({ name: name.trim(), email: e }));
  return null;
}

export async function logIn(email: string, password: string): Promise<string | null> {
  const e = email.trim().toLowerCase();
  const user = users().find((u) => u.email === e);
  if (!user || user.hash !== (await hash(e, password))) return "Email or password is incorrect.";
  writeKey(SESSION, JSON.stringify({ name: user.name, email: user.email }));
  return null;
}

export function logOut() {
  writeKey(SESSION, null);
}

/** undefined while hydrating, null when logged out. */
export function useSession(): Session | null | undefined {
  const raw = useStoredKey(SESSION);
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}
