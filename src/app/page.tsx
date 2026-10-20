import Link from "next/link";
import { FlowGraphic } from "@/components/FlowGraphic";
import { ScalesIcon } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AGENTS } from "@/lib/schemas";

const outputs: Record<string, string> = {
  summarizer: "Plain-language story, parties, timeline",
  analyst: "Key facts, issues, arguments, Acts and sections",
  verifier: "Agreements, differences, inconsistencies, confidence",
  chief: "Findings, strengths and weaknesses, next steps",
};

const steps = [
  { n: "01", title: "Upload the case", text: "Drop a PDF, Word (.docx) or text file, or paste the judgment, FIR, complaint or petition." },
  { n: "02", title: "Four agents read it", text: "Two agents read independently, a third cross-checks them, and a fourth writes the final analysis." },
  { n: "03", title: "Export the report", text: "Download a clean, branded PDF report to share with your advocate, client or study group." },
];

const users = [
  { ico: "🧑‍🤝‍🧑", title: "Citizens", text: "Understand your own case in plain words before you meet a lawyer." },
  { ico: "🎓", title: "Law students", text: "See facts, issues and sections laid out, and compare them with your own reading." },
  { ico: "💼", title: "Lawyers", text: "Get a first-pass brief of long files and spot gaps faster." },
  { ico: "📚", title: "Judges and researchers", text: "Skim structured summaries to reduce the reading load of heavy dockets." },
];

const laws = [
  "Bharatiya Nyaya Sanhita, 2023",
  "BNSS, 2023",
  "Bharatiya Sakshya Adhiniyam, 2023",
  "IPC · CrPC · Evidence Act",
  "Constitution of India",
  "NI Act, 1881",
  "Consumer Protection Act, 2019",
  "CPC, 1908",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <div className="container">
            <div>
              <span className="eyebrow">
                <ScalesIcon size={16} /> Multi-agent legal analysis · Indian law
              </span>
              <h1>
                Understand any case file in <em>minutes</em>, not days.
              </h1>
              <p className="hero-lede">
                LexAgent reads long legal documents with four AI agents that check each other&apos;s work, then gives you a
                clear summary, the legal insights and a final analysis you can export as a PDF.
              </p>
              <div className="hero-cta">
                <Link href="/signup" className="btn btn-primary">
                  Analyze a case free →
                </Link>
                <a href="#how" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
              <p className="hero-note">🛡 Decision support, not a decision. LexAgent never gives a verdict.</p>
            </div>
            <div className="card hero-visual">
              <FlowGraphic />
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2>From a 40-page file to a 2-page brief</h2>
              <p>
                India&apos;s courts carry a huge backlog, and every case starts with someone reading a long document. LexAgent
                does the first read for you.
              </p>
            </div>
            <div className="grid grid-3">
              {steps.map((s) => (
                <div className="card step-card" key={s.n}>
                  <div className="step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="agents">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Meet the agents</span>
              <h2>Four roles, one cross-checked answer</h2>
              <p>
                One AI can be confidently wrong. LexAgent gives the same case to independent agents and makes a third one
                compare them before anything reaches you.
              </p>
            </div>
            <div className="grid grid-2 grid-4">
              {AGENTS.map((a, i) => (
                <div className={`card agent-card c-${a.color}`} key={a.id}>
                  <div className="num">{i + 1}</div>
                  <h3>{a.name}</h3>
                  <p>{a.role}.</p>
                  <p className="out">→ {outputs[a.id]}</p>
                </div>
              ))}
            </div>
            <div className="legal-list" aria-label="Laws the agents know">
              {laws.map((l) => (
                <span className="chip" key={l}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="users">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Who it&apos;s for</span>
              <h2>Built for everyone who reads the law</h2>
            </div>
            <div className="grid grid-2">
              {users.map((u) => (
                <div className="card user-card" key={u.title}>
                  <span className="ico" aria-hidden="true">
                    {u.ico}
                  </span>
                  <div>
                    <h3>{u.title}</h3>
                    <p>{u.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="disclaimer-band">
              <div>
                <h2>Assists understanding. Never replaces your advocate.</h2>
                <p>
                  LexAgent does not give legal judgments or decisions. Always verify sections and citations, and consult a
                  qualified advocate before acting.
                </p>
              </div>
              <Link href="/signup" className="btn">
                Try LexAgent
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
