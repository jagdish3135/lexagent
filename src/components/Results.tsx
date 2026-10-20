import type { Comparison, Final, Insights, Summary } from "@/lib/schemas";

function Section({ n, color, title, agent, children }: { n: number; color: string; title: string; agent: string; children: React.ReactNode }) {
  return (
    <section className={`card result c-${color}`} aria-labelledby={`sec-${n}`}>
      <div className="result-head">
        <span className="badge" aria-hidden="true">
          §{n}
        </span>
        <div>
          <h2 id={`sec-${n}`}>{title}</h2>
          <small>Filed by the {agent}</small>
        </div>
      </div>
      <div className="result-body">{children}</div>
    </section>
  );
}

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) =>
  items.length === 0 ? (
    <p className="muted">None noted.</p>
  ) : ordered ? (
    <ol>{items.map((t, i) => <li key={i}>{t}</li>)}</ol>
  ) : (
    <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
  );

export function SummaryCard({ data }: { data: Summary }) {
  return (
    <Section n={1} color="blue" title="Summary" agent="Summarizer">
      <div>
        <p className="case-title">{data.title || "Case summary"}</p>
        <div className="meta-chips">
          {data.caseType && <span className="chip">{data.caseType}</span>}
          {data.court && <span className="chip">{data.court}</span>}
        </div>
      </div>
      <div>
        <h3>In plain language</h3>
        {data.plainSummary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="cols">
        <div>
          <h3>Parties</h3>
          {data.parties.length ? (
            <ul>
              {data.parties.map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong> <span className="muted">· {p.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Not stated.</p>
          )}
        </div>
        <div>
          <h3>Timeline</h3>
          {data.timeline.length ? (
            <ol className="timeline">
              {data.timeline.map((t, i) => (
                <li key={i}>
                  <span className="d">{t.date}</span>
                  <span>{t.event}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No dates found.</p>
          )}
        </div>
      </div>
    </Section>
  );
}

export function InsightsCard({ data }: { data: Insights }) {
  return (
    <Section n={2} color="amber" title="Legal Insights" agent="Legal Analyst">
      <div className="cols">
        <div>
          <h3>Key facts</h3>
          <List items={data.keyFacts} />
        </div>
        <div>
          <h3>Issues for the court</h3>
          <List items={data.issues} />
        </div>
      </div>
      <div>
        <h3>Arguments</h3>
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
        <h3>Relevant laws</h3>
        {data.laws.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Act</th>
                  <th scope="col">Section</th>
                  <th scope="col">Why it matters</th>
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
          <p className="muted">No laws identified.</p>
        )}
      </div>
    </Section>
  );
}

const LEVEL = { Low: 1, Medium: 2, High: 3 } as const;

export function ComparisonCard({ data }: { data: Comparison }) {
  const level = LEVEL[data.confidence];
  return (
    <Section n={3} color="green" title="Comparison" agent="Cross-Verifier">
      <div className="confidence">
        <span className="meter" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= level ? "on" : ""} />
          ))}
        </span>
        <div>
          <strong>{data.confidence} confidence</strong>
          <p className="muted" style={{ fontSize: 14 }}>
            {data.confidenceNote}
          </p>
        </div>
      </div>
      <div className="cols">
        <div>
          <h3>Agents agree</h3>
          <ul className="check-list">
            {data.agreements.map((t, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Differences</h3>
          <ul className="check-list">
            {data.differences.map((t, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">≠</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3>Inconsistencies</h3>
        {data.inconsistencies.length ? (
          <ul className="check-list warn">
            {data.inconsistencies.map((t, i) => (
              <li key={i}>
                <span className="mk" aria-hidden="true">!</span>
                {t}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">✓ No inconsistencies found between the two readings.</p>
        )}
      </div>
    </Section>
  );
}

export function FinalCard({ data }: { data: Final }) {
  return (
    <Section n={4} color="red" title="Final Analysis" agent="Chief Analyst">
      <p style={{ font: "400 1.45rem/1.35 var(--serif)" }}>{data.overview}</p>
      <div>
        <h3>Key findings</h3>
        <List items={data.keyFindings} />
      </div>
      <div className="cols">
        {data.sides.map((s, i) => (
          <div className="subcard" key={i}>
            <h4>{s.side}</h4>
            <p className="lbl">STRENGTHS</p>
            <List items={s.strengths} />
            <p className="lbl">WEAKNESSES</p>
            <List items={s.weaknesses} />
          </div>
        ))}
      </div>
      <div className="cols">
        <div>
          <h3>Open questions</h3>
          <List items={data.openQuestions} />
        </div>
        <div>
          <h3>Suggested next steps</h3>
          <List items={data.nextSteps} ordered />
        </div>
      </div>
      <p className="small-print">
        This analysis assists understanding only. It is not a judgment or legal advice. Verify every section and consult a
        qualified advocate.
      </p>
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
