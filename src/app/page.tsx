import type { CSSProperties } from "react";
import Link from "next/link";
import { CaseFile } from "@/components/CaseFile";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AGENTS } from "@/lib/schemas";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const files: Record<string, string[]> = {
  summarizer: ["Plain-language story", "Parties", "Timeline"],
  analyst: ["Key facts", "Issues for the court", "Arguments", "Acts & sections"],
  verifier: ["Agreements", "Differences", "Inconsistencies", "Confidence"],
  chief: ["Key findings", "Strengths & weaknesses", "Open questions", "Next steps"],
};

const stages = [
  { n: "i.", label: "Filing", title: "Upload the case", text: "Drop a PDF, Word (.docx) or text file, or paste a judgment, FIR, complaint or petition. Text is read in your browser; the file never leaves it." },
  { n: "ii.", label: "Hearing", title: "Four agents read it", text: "Two agents read independently. A third cross-examines their readings against the document. A fourth writes the brief." },
  { n: "iii.", label: "Order", title: "Take the report", text: "Export a typeset PDF with the LexAgent seal, ready for your advocate, your client, or your study group." },
];

const readers = [
  { who: "Citizens", line: "“What does this notice actually say about me?”" },
  { who: "Law students", line: "“Which issues did the court have to decide?”" },
  { who: "Advocates", line: "“Give me the first read of this 40-page file.”" },
  { who: "Judges & researchers", line: "“Summarise the docket before the hearing.”" },
];

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
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <div className="container">
            <div>
              <span className="kicker rise" style={i(0)}>
                In re: the pile of case files on your desk
              </span>
              <h1 className="rise" style={i(1)}>
                Four minds read the case. <em>You</em> read the <span className="strike">file</span> brief.
              </h1>
              <p className="lede rise" style={i(2)}>
                LexAgent reads long Indian legal documents with four AI agents that check each other&apos;s work, then hands
                you a plain summary, the law that applies, a cross-examination of both readings and a final analysis, typeset
                as a PDF.
              </p>
              <div className="hero-cta rise" style={i(3)}>
                <Link href="/signup" className="btn btn-primary">
                  File your first case →
                </Link>
                <a href="/sample-report.pdf" className="text-link" target="_blank" rel="noopener">
                  Read a sample report
                </a>
              </div>
              <div className="ledger rise" style={i(4)}>
                <div>
                  <b>4</b>
                  <span>Agents on the bench</span>
                </div>
                <div>
                  <b>2</b>
                  <span>Independent readings</span>
                </div>
                <div>
                  <b>1</b>
                  <span>Cross-examination</span>
                </div>
                <div>
                  <b>0</b>
                  <span>Verdicts. Ever.</span>
                </div>
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
                <span className="kicker">The proceedings</span>
                <h2>
                  From a forty-page file to a <em>two-page</em> brief.
                </h2>
              </div>
              <p>
                India&apos;s courts carry a backlog of crores of cases, and every one of them begins with someone reading a long
                document. LexAgent does the first reading, so you can start from understanding.
              </p>
            </div>
            <div className="stages">
              {stages.map((s) => (
                <article className="stage" key={s.n}>
                  <div className="numeral">{s.n}</div>
                  <span className="mono muted">Stage · {s.label}</span>
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
                <span className="kicker">The bench of four</span>
                <h2>
                  One AI can be confidently wrong. <em>Four</em> keep each other honest.
                </h2>
              </div>
              <p>
                Every agent works from the same document under the same rules: ground every point in the text, never invent a
                citation, never deliver a verdict, and know that BNS, BNSS and BSA replaced the IPC, CrPC and Evidence Act in 2024.
              </p>
            </div>
            <div className="bench">
              {AGENTS.map((a, n) => (
                <div className={`bench-row c-${a.color}`} key={a.id}>
                  <span className="no">{["i", "ii", "iii", "iv"][n]}</span>
                  <h3>{a.name}</h3>
                  <p>{a.role}.</p>
                  <ul>
                    {files[a.id]!.map((f) => (
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
                <span className="kicker">Who reads with LexAgent</span>
                <h2>
                  Built for everyone who has to <em>read</em> the law.
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
                  NOT A<big>judgment</big>LEXAGENT
                </span>
              </div>
              <div>
                <h2>
                  It assists understanding. It never replaces your <em>advocate</em>, or the court.
                </h2>
                <p>
                  LexAgent gives no legal judgments or decisions. Verify every section and citation against the record, and
                  consult a qualified advocate before you act.
                </p>
              </div>
              <Link href="/signup" className="btn">
                Open your docket →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
