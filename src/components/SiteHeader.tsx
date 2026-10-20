"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Dateline({ name }: { name?: string }) {
  const { t } = useLang();
  return (
    <div className="dateline mono" aria-hidden="true">
      <div className="container">
        <span>{t("dateline.left")}</span>
        <span className="hide-sm">{name ? t("dateline.desk", { name }) : t("dateline.right")}</span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  return (
    <>
      <Dateline />
      <header className="site-header">
        <div className="container">
          <Logo />
          <nav className="header-actions" aria-label="Main">
            <div className="nav-links">
              <a href="#proceedings">{t("nav.proceedings")}</a>
              <a href="#bench">{t("nav.bench")}</a>
              <a href="#readers">{t("nav.readers")}</a>
            </div>
            <LangSwitch />
            <ThemeToggle />
            <Link href="/login" className="btn btn-ghost hide-sm">
              {t("nav.login")}
            </Link>
            <Link href="/signup" className="btn btn-primary hide-sm">
              {t("nav.file")}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
