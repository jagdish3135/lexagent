"use client";
import { readKey, useStoredKey, writeKey } from "./client-store";
import { isRole, type Role } from "./locale";

// DEMO AUTH ONLY. Accounts live in this browser's localStorage; nothing is sent to a server.
// Replace with a real auth provider before storing anything sensitive.
const USERS = "lexagent.users";
const SESSION = "lexagent.session";

export interface Session {
  name: string;
  email: string;
  role: Role;
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

/** Returns null on success, or an error code the UI translates. */
export async function signUp(name: string, email: string, password: string, role: Role): Promise<"exists" | null> {
  const e = email.trim().toLowerCase();
  const all = users();
  if (all.some((u) => u.email === e)) return "exists";
  const session: Session = { name: name.trim(), email: e, role };
  all.push({ ...session, hash: await hash(e, password) });
  writeKey(USERS, JSON.stringify(all));
  writeKey(SESSION, JSON.stringify(session));
  return null;
}

export async function logIn(email: string, password: string): Promise<"wrong" | null> {
  const e = email.trim().toLowerCase();
  const user = users().find((u) => u.email === e);
  if (!user || user.hash !== (await hash(e, password))) return "wrong";
  writeKey(SESSION, JSON.stringify({ name: user.name, email: user.email, role: user.role }));
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
    const s = JSON.parse(raw) as Session;
    return { ...s, role: isRole(s.role) ? s.role : "citizen" }; // accounts made before roles existed
  } catch {
    return null;
  }
}
