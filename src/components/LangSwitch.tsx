"use client";
import { useEffect } from "react";
import { LANGS, setLang, useLang } from "@/lib/i18n";

export function LangSwitch() {
  const { lang, t } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <div className="lang-switch" role="group" aria-label={t("nav.language")}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" aria-pressed={lang === l.id} title={l.label} lang={l.id} onClick={() => setLang(l.id)}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
