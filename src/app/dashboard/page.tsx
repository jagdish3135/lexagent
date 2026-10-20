"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Logo, ScalesIcon } from "@/components/Logo";
import { ComparisonCard, FinalCard, InsightsCard, SkeletonCard, SummaryCard } from "@/components/Results";
import { SiteFooter } from "@/components/SiteFooter";
import { Dateline } from "@/components/SiteHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logOut, useSession } from "@/lib/auth";
import { ACCEPT, ExtractError, extractText } from "@/lib/extract";
import { SAMPLES } from "@/lib/samples";
import {
  AGENTS,
  type AgentId,
  type AgentOutputs,
  type AgentStatus,
  type Comparison,
  type Final,
  type Insights,
  type StreamEvent,
  type Summary,
} from "@/lib/schemas";

const MIN_CHARS = 200;
const ROMAN = ["i", "ii", "iii", "iv"];
const idle = (): Record<AgentId, AgentStatus> => ({ summarizer: "waiting", analyst: "waiting", verifier: "waiting", chief: "waiting" });
const STATUS_TEXT: Record<AgentStatus, string> = {
  waiting: "Waiting",
  working: "Working…",
  done: "Done",
  failed: "Failed",
  skipped: "Skipped",
};

type Meta = Extract<StreamEvent, { type: "meta" }>;

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [sampleTitle, setSampleTitle] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState(idle);
  const [outputs, setOutputs] = useState<AgentOutputs>({});
  const [agentErrors, setAgentErrors] = useState<Partial<Record<AgentId, string>>>({});
  const [meta, setMeta] = useState<Meta | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  if (!session) {
    return (
      <main className="auth-wrap" aria-busy="true">
        <span className="spinner" aria-label="Loading" />
      </main>
    );
  }

  const started = running || meta !== null || fatal !== null;
  const allDone = Boolean(outputs.chief);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setInputError(null);
    setExtracting(true);
    try {
      const extracted = await extractText(file);
      setText(extracted);
      setFileName(file.name);
      setSampleTitle(null);
    } catch (err) {
      setInputError(err instanceof ExtractError ? err.message : "Could not read this file. Try another file or paste the text.");
    } finally {
      setExtracting(false);
    }
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(false);
    void onFile(e.dataTransfer.files[0]);
  }

  async function analyze() {
    setRunning(true);
    setStatuses(idle());
    setOutputs({});
    setAgentErrors({});
    setMeta(null);
    setFatal(null);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "The analysis could not start. Please try again.");
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) if (line.trim()) handle(JSON.parse(line) as StreamEvent);
      }
    } catch (err) {
      setFatal(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  function handle(e: StreamEvent) {
    if (e.type === "meta") setMeta(e);
    else if (e.type === "error") setFatal(e.error);
    else if (e.type === "status") {
      setStatuses((s) => ({ ...s, [e.agent]: e.status }));
      if (e.output) setOutputs((o) => ({ ...o, [e.agent]: e.output }));
      if (e.error) setAgentErrors((x) => ({ ...x, [e.agent]: e.error }));
    }
  }

  async function exportPdf() {
    setExporting(true);
    try {
      const { downloadReport } = await import("@/lib/pdf/download");
      await downloadReport(outputs, { mode: meta?.mode ?? "demo", model: meta?.model ?? "", source: fileName ?? sampleTitle ?? "Pasted text" });
    } catch {
      setFatal("The PDF could not be created. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  const tooShort = text.trim().length < MIN_CHARS;
  const firstName = session.name.split(" ")[0];

  return (
    <>
      <Dateline right={`Desk of ${session.name}`} />
      <header className="site-header">
        <div className="container">
          <Logo href="/dashboard" />
          <div className="header-actions">
            <span className="chip hide-sm" title={session.email}>
              {session.name}
            </span>
            <ThemeToggle />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                logOut();
                router.push("/");
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="dash" id="main">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="kicker">The case desk</span>
              <h1>
                Namaste, <em>{firstName}</em>.
              </h1>
              <p>File a case document and four agents will read it for you.</p>
            </div>
            <span className="mono muted hide-sm">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>

          <div className="dash-grid">
            <div className="card panel input-panel">
              <div className="panel-head mono">
                <span>Form 1 · New filing</span>
                <span>{text ? "Ready" : "Blank"}</span>
              </div>
              <div className="panel-body">
              <h2>File a case</h2>
              <label
                className={`dropzone${drag ? " drag" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3" />
                </svg>
                <strong>{extracting ? "Reading the document…" : "Drop a file or click to upload"}</strong>
                <span>PDF, DOCX or TXT · up to 10 MB</span>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="sr-only"
                  aria-label="Upload a case document"
                  disabled={extracting || running}
                  onChange={(e) => {
                    void onFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {fileName && (
                <div className="file-pill">
                  <span>📄 {fileName}</span>
                  <span className="muted">{text.length.toLocaleString("en-IN")} chars</span>
                </div>
              )}
              {inputError && (
                <p className="notice error" role="alert" style={{ marginTop: 10, marginBottom: 0 }}>
                  {inputError}
                </p>
              )}

              <div className="samples">
                <span>Or cite a precedent sample</span>
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="sample-btn"
                    disabled={running}
                    onClick={() => {
                      setText(s.text);
                      setFileName(null);
                      setSampleTitle(s.demo.summarizer.title);
                      setInputError(null);
                    }}
                  >
                    {s.label}
                    <small>{s.hint}</small>
                  </button>
                ))}
              </div>

              <label htmlFor="case-text" className="sr-only">
                Case text
              </label>
              <textarea
                id="case-text"
                className="textarea"
                placeholder="…or paste the judgment, complaint, FIR or petition here."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSampleTitle(null);
                }}
                disabled={running}
              />
              <div className="textarea-meta">
                <span>
                  {text.length.toLocaleString("en-IN")} characters
                  {text.length > 0 && tooShort && ` · need at least ${MIN_CHARS}`}
                </span>
                {text && !running && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setText("");
                      setFileName(null);
                      setSampleTitle(null);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <button type="button" className="btn btn-primary analyze-btn" disabled={tooShort || running || extracting} onClick={analyze}>
                {running ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Agents are working…
                  </>
                ) : (
                  <>
                    <ScalesIcon /> Analyze Case
                  </>
                )}
              </button>
              <p className="small-print">
                Only the extracted text is sent for analysis. LexAgent assists understanding and is not legal advice.
              </p>
              </div>
            </div>

            <div ref={resultsRef} style={{ scrollMarginTop: 84 }} aria-live="polite">
              {!started ? (
                <div className="card empty">
                  <span className="kicker">Order sheet · awaiting filing</span>
                  <h2>
                    The bench is <em>ready</em>.
                  </h2>
                  <p>Upload a document or cite a sample, then press Analyze Case. You&apos;ll watch each agent read, in order, as it happens.</p>
                  <div className="progress-row" style={{ width: "100%", marginTop: 18 }}>
                    {AGENTS.map((a, i) => (
                      <div key={a.id} className={`agent-chip c-${a.color}`} data-status="waiting">
                        <span className="dot">{ROMAN[i]}</span>
                        <span style={{ textAlign: "left", minWidth: 0 }}>
                          <span className="nm">{a.name}</span>
                          <span className="st">{a.section}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="card progress" role="status" aria-label="Agent progress">
                    <div className="progress-row">
                      {AGENTS.map((a, i) => (
                        <div key={a.id} className={`agent-chip c-${a.color}`} data-status={statuses[a.id]}>
                          <span className="dot">{statuses[a.id] === "done" ? "✓" : statuses[a.id] === "failed" || statuses[a.id] === "skipped" ? "!" : ROMAN[i]}</span>
                          <span style={{ minWidth: 0 }}>
                            <span className="nm" style={{ display: "block" }}>{a.name}</span>
                            <span className="st">{STATUS_TEXT[statuses[a.id]]}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="results-bar">
                    {meta ? (
                      <span className={`mode-badge${meta.mode === "demo" ? " demo" : ""}`}>
                        {meta.mode === "demo" ? "● Demo mode · sample analysis" : `● Live AI · ${meta.model}`}
                      </span>
                    ) : (
                      <span />
                    )}
                    {allDone && (
                      <button type="button" className="btn btn-primary" onClick={exportPdf} disabled={exporting}>
                        {exporting ? <span className="spinner" aria-hidden="true" /> : "⬇"} Export PDF report
                      </button>
                    )}
                  </div>

                  {fatal && (
                    <p className="notice error" role="alert">
                      {fatal}
                    </p>
                  )}
                  {meta?.mode === "demo" && !sampleTitle && (
                    <p className="notice">
                      Demo mode: no AI key is set on the server, so you are seeing the analysis of a sample case, not your
                      document.
                    </p>
                  )}
                  {meta?.truncated && (
                    <p className="notice">
                      This document is long, so the agents read the first {meta.chars.toLocaleString("en-IN")} characters.
                    </p>
                  )}
                  {Object.entries(agentErrors).map(([id, msg]) => (
                    <p key={id} className="notice error">
                      {AGENTS.find((a) => a.id === id)?.name}: {msg}
                    </p>
                  ))}

                  {outputs.summarizer ? <SummaryCard data={outputs.summarizer as Summary} /> : statuses.summarizer === "working" && <SkeletonCard color="blue" title="Summary" />}
                  {outputs.analyst ? <InsightsCard data={outputs.analyst as Insights} /> : statuses.analyst === "working" && <SkeletonCard color="amber" title="Legal Insights" />}
                  {outputs.verifier ? <ComparisonCard data={outputs.verifier as Comparison} /> : statuses.verifier === "working" && <SkeletonCard color="green" title="Comparison" />}
                  {outputs.chief ? <FinalCard data={outputs.chief as Final} /> : statuses.chief === "working" && <SkeletonCard color="red" title="Final Analysis" />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
