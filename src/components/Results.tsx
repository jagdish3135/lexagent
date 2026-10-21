"use client";
import { useLang } from "@/lib/i18n";
import type { Comparison, Final, Insights, Summary } from "@/lib/schemas";

function Section({ n, color, title, agent, children }: { n: number; color: string; title: string; agent: string; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <section className={`card result c-${color}`} aria-labelledby={`sec-${n}`}>
      <div className="result-head">
        <span className="badge" aria-hidden="true">
          §{n}
        </span>
        <div>
          <h2 id={`sec-${n}`}>{title}</h2>
          <small>{t("sec.by", { agent })}</small>
        </div>
      </div>
      <div className="result-body">{children}</div>
    </section>
  );
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const { t } = useLang();
  if (items.length === 0) return <p className="muted">{t("r.none")}</p>;
  return ordered ? <ol>{items.map((x, i) => <li key={i}>{x}</li>)}</ol> : <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

export function SummaryCard({ data }: { data: Summary }) {
  const { t } = useLang();
  return (
    <Section n={1} color="blue" title={t("sec.summary")} agent={t("agent.summarizer")}>
      <div>
        <p className="case-title">{data.title || t("r.caseSummary")}</p>
        <div className="meta-chips">
          {data.caseType && <span className="chip">{data.caseType}</span>}
          {data.court && <span className="chip">{data.court}</span>}
          {data.documentLanguage && <span className="chip">{t("r.docLang", { lang: data.documentLanguage })}</span>}
        </div>
      </div>
      <div>
        <h3>{t("r.plain")}</h3>
        {data.plainSummary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="cols">
        <div>
          <h3>{t("r.parties")}</h3>
          {data.parties.length ? (
            <ul>
              {data.parties.map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong> <span className="muted">· {p.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t("r.notStated")}</p>
          )}
        </div>
        <div>
          <h3>{t("r.timeline")}</h3>
          {data.timeline.length ? (
            <ol className="timeline">
              {data.timeline.map((ev, i) => (
                <li key={i}>
                  <span className="d">{ev.date}</span>
                  <span>{ev.event}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">{t("r.noDates")}</p>
          )}
        </div>
      </div>
    </Section>
  );
}

export function InsightsCard({ data }: { data: Insights }) {
  const { t } = useLang();
  return (
    <Section n={2} color="amber" title={t("sec.insights")} agent={t("agent.analyst")}>
      <div className="cols">
        <div>
          <h3>{t("r.facts")}</h3>
          <List items={data.keyFacts} />
        </div>
        <div>
          <h3>{t("r.issues")}</h3>
          <List items={data.issues} />
        </div>
      </div>
      <div>
        <h3>{t("r.arguments")}</h3>
        <div className="cols">
          {data.arguments.map((a, i) => (
            <div className="subcard" key={i}>
              <h4>{a.side}</h4>
              <List items={a.points} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>{t("r.laws")}</h3>
        {data.laws.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t("r.act")}</th>
                  <th scope="col">{t("r.section")}</th>
                  <th scope="col">{t("r.why")}</th>
                </tr>
              </thead>
              <tbody>
                {data.laws.map((l, i) => (
                  <tr key={i}>
                    <td>{l.law}</td>
                    <td className="sec">{l.section}</td>
                    <td>{l.relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">{t("r.noLaws")}</p>
        )}
      </div>
    </Section>
  );
}

const LEVEL = { Low: 1, Medium: 2, High: 3 } as const;

export function ComparisonCard({ data }: { data: Comparison }) {
  const { t } = useLang();
  const level = LEVEL[data.confidence];
  return (
    <Section n={3} color="green" title={t("sec.comparison")} agent={t("agent.verifier")}>
      <div className="confidence">
        <span className="meter" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= level ? "on" : ""} />
          ))}
        </span>
        <div>
          <strong>{t("r.confidence", { level: t(`r.${data.confidence}`) })}</strong>
          <p className="muted" style={{ fontSize: 14 }}>
            {data.confidenceNote}
          </p>
        </div>
      </div>
      <div className="cols">
        <div>
          <h3>{t("r.agree")}</h3>
          <ul className="check-list">
            {data.agreements.map((x, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">✓</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t("r.differ")}</h3>
          <ul className="check-list">
            {data.differences.map((x, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">≠</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3>{t("r.inconsistent")}</h3>
        {data.inconsistencies.length ? (
          <ul className="check-list warn">
            {data.inconsistencies.map((x, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">!</span>
                {x}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">✓ {t("r.noIncons")}</p>
        )}
      </div>
    </Section>
  );
}

export function FinalCard({ data }: { data: Final }) {
  const { t } = useLang();
  return (
    <Section n={4} color="red" title={t("sec.final")} agent={t("agent.chief")}>
      <p style={{ font: "400 1.45rem/1.35 var(--serif)" }}>{data.overview}</p>
      <div>
        <h3>{t("r.findings")}</h3>
        <List items={data.keyFindings} />
      </div>
      <div className="cols">
        {data.sides.map((s, i) => (
          <div className="subcard" key={i}>
            <h4>{s.side}</h4>
            <p className="lbl">{t("r.strengths").toUpperCase()}</p>
            <List items={s.strengths} />
            <p className="lbl">{t("r.weaknesses").toUpperCase()}</p>
            <List items={s.weaknesses} />
          </div>
        ))}
      </div>
      <div className="cols">
        <div>
          <h3>{t("r.questions")}</h3>
          <List items={data.openQuestions} />
        </div>
        <div>
          <h3>{t("r.next")}</h3>
          <List items={data.nextSteps} ordered />
        </div>
      </div>
      <p className="small-print">{t("r.disclaimer")}</p>
    </Section>
  );
}

export function SkeletonCard({ color, title }: { color: string; title: string }) {
  return (
    <div className={`card result c-${color}`} aria-hidden="true">
      <div className="result-head">
        <span className="badge" />
        <h2>{title}</h2>
      </div>
      <div className="result-body">
        <div className="skeleton" style={{ width: "70%" }} />
        <div className="skeleton" />
        <div className="skeleton" style={{ width: "85%" }} />
        <div className="skeleton" style={{ width: "55%" }} />
      </div>
    </div>
  );
}
