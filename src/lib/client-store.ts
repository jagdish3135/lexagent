"use client";
import { useSyncExternalStore } from "react";

// Tiny localStorage-backed stores shared by the theme toggle and the demo auth.
const EVENT = "lexagent:storage";

export function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeKey(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the app still works for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Returns the stored string, null when missing, or undefined during server render and hydration. */
export function useStoredKey(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => readKey(key),
    () => undefined,
  );
}
