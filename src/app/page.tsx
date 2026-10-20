"use client";
import type { CSSProperties } from "react";
import Link from "next/link";
import { CaseFile } from "@/components/CaseFile";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang, type Key } from "@/lib/i18n";
import { AGENTS } from "@/lib/schemas";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const statutes = [
  "Bharatiya Nyaya Sanhita, 2023",
  "Bharatiya Nagarik Suraksha Sanhita, 2023",
  "Bharatiya Sakshya Adhiniyam, 2023",
  "Constitution of India",
  "Negotiable Instruments Act, 1881",
  "Consumer Protection Act, 2019",
  "Code of Civil Procedure, 1908",
  "Indian Penal Code, 1860",
  "Code of Criminal Procedure, 1973",
  "Indian Evidence Act, 1872",
];

export default function Home() {
  const { t } = useLang();
  const stages = [1, 2, 3].map((n) => ({
    n: ["i.", "ii.", "iii."][n - 1],
    label: t(`stage${n}.label` as Key),
    title: t(`stage${n}.title` as Key),
    text: t(`stage${n}.text` as Key),
  }));
  const readers = (["citizen", "student", "advocate", "judge"] as const).map((r) => ({
    who: t(`reader.${r}` as Key),
    line: t(`reader.${r}.q` as Key),
  }));

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <div className="container">
            <div>
              <span className="kicker rise" style={i(0)}>
                {t("hero.kicker")}
              </span>
              <h1 className="rise" style={i(1)}>
                {t("hero.h1")} <em>{t("hero.you")}</em> {t("hero.mid")} <span className="strike">{t("hero.file")}</span>{" "}
                {t("hero.end")}
              </h1>
              <p className="lede rise" style={i(2)}>
                {t("hero.lede")}
              </p>
              <div className="hero-cta rise" style={i(3)}>
                <Link href="/signup" className="btn btn-primary">
                  {t("hero.cta")}
                </Link>
                <a href="/sample-report.pdf" className="text-link" target="_blank" rel="noopener">
                  {t("hero.sample")}
                </a>
              </div>
              <div className="ledger rise" style={i(4)}>
                {(
                  [
                    ["4", "ledger.agents"],
                    ["2", "ledger.readings"],
                    ["1", "ledger.cross"],
                    ["0", "ledger.verdicts"],
                  ] as const
                ).map(([n, k]) => (
                  <div key={k}>
                    <b>{n}</b>
                    <span>{t(k)}</span>
                  </div>
                ))}
              </div>
            </div>
            <CaseFile />
          </div>
        </section>

        <div className="ticker" aria-label="Laws the agents know">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <span key={copy} aria-hidden={copy === 1}>
                {statutes.map((s) => (
                  <span key={s}>
                    {s}
                    <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="proceedings">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="kicker">{t("proc.kicker")}</span>
                <h2>
                  {t("proc.h2a")} <em>{t("proc.h2em")}</em> {t("proc.h2b")}
                </h2>
              </div>
              <p>{t("proc.p")}</p>
            </div>
            <div className="stages">
              {stages.map((s) => (
                <article className="stage" key={s.n}>
                  <div className="numeral">{s.n}</div>
                  <span className="mono muted">
                    {t("stage")} · {s.label}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="bench">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="kicker">{t("bench.kicker")}</span>
                <h2>
                  {t("bench.h2a")} <em>{t("bench.h2em")}</em> {t("bench.h2b")}
                </h2>
              </div>
              <p>{t("bench.p")}</p>
            </div>
            <div className="bench">
              {AGENTS.map((a, n) => (
                <div className={`bench-row c-${a.color}`} key={a.id}>
                  <span className="no">{["i", "ii", "iii", "iv"][n]}</span>
                  <h3>{t(`agent.${a.id}` as Key)}</h3>
                  <p>{t(`agent.${a.id}.role` as Key)}.</p>
                  <ul>
                    {t(`agent.${a.id}.files` as Key)
                      .split("|")
                      .map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="readers">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="kicker">{t("readers.kicker")}</span>
                <h2>
                  {t("readers.h2a")} <em>{t("readers.h2em")}</em> {t("readers.h2b")}
                </h2>
              </div>
            </div>
            <div className="readers">
              {readers.map((r) => (
                <div className="reader" key={r.who}>
                  <span className="mono muted">{r.who}</span>
                  <blockquote>{r.line}</blockquote>
                </div>
              ))}
            </div>

            <div className="verdict">
              <div className="big-stamp" aria-hidden="true">
                <span>
                  {t("verdict.stampTop")}
                  <big>{t("verdict.stampBig")}</big>LEXAGENT
                </span>
              </div>
              <div>
                <h2>
                  {t("verdict.h2a")} <em>{t("verdict.h2em")}</em>
                  {t("verdict.h2b")}
                </h2>
                <p>{t("verdict.p")}</p>
              </div>
              <Link href="/signup" className="btn">
                {t("verdict.cta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
