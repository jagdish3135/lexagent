"use client";
import { useSyncExternalStore } from "react";
import { writeKey } from "@/lib/client-store";

// Light is the default whatever the system setting; dark only when the user chooses it.
function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  window.addEventListener("lexagent:storage", cb);
  return () => window.removeEventListener("lexagent:storage", cb);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => null);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="btn btn-ghost icon-btn"
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
      title={theme ? `Switch to ${next} theme` : "Toggle theme"}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        writeKey("lexagent.theme", next);
      }}
    >
      {theme === "dark" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
