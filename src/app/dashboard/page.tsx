"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { LangSwitch } from "@/components/LangSwitch";
import { Logo, ScalesIcon } from "@/components/Logo";
import { ComparisonCard, FinalCard, InsightsCard, SkeletonCard, SummaryCard } from "@/components/Results";
import { SiteFooter } from "@/components/SiteFooter";
import { Dateline } from "@/components/SiteHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logOut, useSession } from "@/lib/auth";
import { ACCEPT, ExtractError, extractText } from "@/lib/extract";
import { LANGS, useLang, type Key } from "@/lib/i18n";
import { SAMPLES } from "@/lib/samples";
import { SAMPLE_FILES, SAMPLE_FORMATS } from "@/lib/sample-files";
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

type Meta = Extract<StreamEvent, { type: "meta" }>;

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();
  const { lang, t } = useLang();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [sampleTitle, setSampleTitle] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [inputError, setInputError] = useState<Key | null>(null);
  const [drag, setDrag] = useState(false);

  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState(idle);
  const [outputs, setOutputs] = useState<AgentOutputs>({});
  const [agentErrors, setAgentErrors] = useState<Partial<Record<AgentId, string>>>({});
  const [meta, setMeta] = useState<Meta | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [runLang, setRunLang] = useState(lang);
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
  const langName = LANGS.find((l) => l.id === lang)!.label;

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
      setInputError(err instanceof ExtractError ? err.code : "err.file");
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
    setRunLang(lang);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang, role: session!.role }),
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? t("err.start"));
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
      setFatal(err instanceof Error ? err.message : t("err.generic"));
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
      // Demo analyses are English, so their PDF stays English whatever the interface language.
      const pdfLang = meta?.mode === "demo" ? "en" : runLang;
      await downloadReport(outputs, {
        mode: meta?.mode ?? "demo",
        model: meta?.model ?? "",
        source: fileName ?? sampleTitle ?? "",
        lang: pdfLang,
      });
    } catch {
      setFatal(t("err.pdf"));
    } finally {
      setExporting(false);
    }
  }

  const tooShort = text.trim().length < MIN_CHARS;
  const firstName = session.name.split(" ")[0];
  const n = (x: number) => x.toLocaleString("en-IN");

  return (
    <>
      <Dateline name={session.name} />
      <header className="site-header">
        <div className="container">
          <Logo href="/dashboard" />
          <div className="header-actions">
            <span className="chip hide-sm" title={session.email}>
              {t(`role.${session.role}` as Key)}
            </span>
            <LangSwitch />
            <ThemeToggle />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                logOut();
                router.push("/");
              }}
            >
              {t("nav.logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="dash" id="main">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="kicker">{t("dash.kicker")}</span>
              <h1>
                {t("dash.hello")} <em>{firstName}</em>
              </h1>
              <p>{t("dash.sub")}</p>
            </div>
            <span className="mono muted">{t("dash.outputIn", { lang: langName, role: t(`role.${session.role}` as Key) })}</span>
          </div>

          <div className="dash-grid">
            <div className="card panel input-panel">
              <div className="panel-head mono">
                <span>{t("dash.form")}</span>
                <span>{text ? t("dash.ready") : t("dash.blank")}</span>
              </div>
              <div className="panel-body">
                <h2>{t("dash.h2")}</h2>
                <label
                  className={`dropzone${drag ? " drag" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--seal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                    <path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3" />
                  </svg>
                  <strong>{extracting ? t("dash.reading") : t("dash.drop")}</strong>
                  <span>{t("dash.types")}</span>
                  <input
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    aria-label={t("dash.uploadLabel")}
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
                    <span className="muted">{t("dash.chars", { n: n(text.length) })}</span>
                  </div>
                )}
                {inputError && (
                  <p className="notice error" role="alert" style={{ marginTop: 10, marginBottom: 0 }}>
                    {t(inputError)}
                  </p>
                )}

                <div className="samples">
                  <span>{t("dash.samples")}</span>
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
                      {t(`sample.${s.id}` as Key)}
                      <small>{t(`sample.${s.id}.hint` as Key)}</small>
                    </button>
                  ))}
                </div>
                <details className="sample-files">
                  <summary>{t("dash.files")}</summary>
                  <ul>
                    {SAMPLE_FILES.map((f) => (
                      <li key={f.slug}>
                        {f.title}
                        <br />
                        {SAMPLE_FORMATS.map((ext, i) => (
                          <span key={ext}>
                            {i > 0 && " · "}
                            <a href={`/sample-cases/${f.slug}.${ext}`} download>
                              {ext.toUpperCase()}
                            </a>
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </details>

                <label htmlFor="case-text" className="sr-only">
                  {t("dash.textLabel")}
                </label>
                <textarea
                  id="case-text"
                  className="textarea"
                  placeholder={t("dash.placeholder")}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setSampleTitle(null);
                  }}
                  disabled={running}
                />
                <div className="textarea-meta">
                  <span>
                    {t("dash.chars", { n: n(text.length) })}
                    {text.length > 0 && tooShort && ` · ${t("dash.need", { n: MIN_CHARS })}`}
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
                      {t("dash.clear")}
                    </button>
                  )}
                </div>
                <button type="button" className="btn btn-primary analyze-btn" disabled={tooShort || running || extracting} onClick={analyze}>
                  {running ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> {t("dash.working")}
                    </>
                  ) : (
                    <>
                      <ScalesIcon /> {t("dash.analyze")}
                    </>
                  )}
                </button>
                <p className="small-print">{t("dash.print")}</p>
              </div>
            </div>

            <div ref={resultsRef} style={{ scrollMarginTop: 84 }} aria-live="polite">
              {!started ? (
                <div className="card empty">
                  <span className="kicker">{t("empty.kicker")}</span>
                  <h2>
                    {t("empty.h2a")} <em>{t("empty.h2em")}</em>
                  </h2>
                  <p>{t("empty.p")}</p>
                  <div className="progress-row" style={{ width: "100%", marginTop: 18 }}>
                    {AGENTS.map((a, i) => (
                      <div key={a.id} className={`agent-chip c-${a.color}`} data-status="waiting">
                        <span className="dot">{ROMAN[i]}</span>
                        <span style={{ textAlign: "left", minWidth: 0 }}>
                          <span className="nm">{t(`agent.${a.id}` as Key)}</span>
                          <span className="st">{t(`sec.${["summary", "insights", "comparison", "final"][i]}` as Key)}</span>
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
                          <span className="dot">
                            {statuses[a.id] === "done" ? "✓" : statuses[a.id] === "failed" || statuses[a.id] === "skipped" ? "!" : ROMAN[i]}
                          </span>
                          <span style={{ minWidth: 0 }}>
                            <span className="nm">{t(`agent.${a.id}` as Key)}</span>
                            <span className="st">{t(`status.${statuses[a.id]}` as Key)}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="results-bar">
                    {meta ? (
                      <span className={`mode-badge${meta.mode === "demo" ? " demo" : ""}`}>
                        ● {meta.mode === "demo" ? t("mode.demo") : t("mode.live", { model: meta.model })}
                      </span>
                    ) : (
                      <span />
                    )}
                    {allDone && (
                      <button type="button" className="btn btn-primary" onClick={exportPdf} disabled={exporting}>
                        {exporting ? <span className="spinner" aria-hidden="true" /> : "⬇"} {t("dash.export")}
                      </button>
                    )}
                  </div>

                  {fatal && (
                    <p className="notice error" role="alert">
                      {fatal}
                    </p>
                  )}
                  {meta?.mode === "demo" && !sampleTitle && <p className="notice">{t("notice.demo")}</p>}
                  {meta?.mode === "demo" && runLang !== "en" && <p className="notice">{t("notice.demoLang")}</p>}
                  {meta?.truncated && <p className="notice">{t("notice.truncated", { n: n(meta.chars) })}</p>}
                  {Object.entries(agentErrors).map(([id, msg]) => (
                    <p key={id} className="notice error">
                      {t(`agent.${id}` as Key)}: {msg}
                    </p>
                  ))}

                  {outputs.summarizer ? <SummaryCard data={outputs.summarizer as Summary} /> : statuses.summarizer === "working" && <SkeletonCard color="blue" title={t("sec.summary")} />}
                  {outputs.analyst ? <InsightsCard data={outputs.analyst as Insights} /> : statuses.analyst === "working" && <SkeletonCard color="amber" title={t("sec.insights")} />}
                  {outputs.verifier ? <ComparisonCard data={outputs.verifier as Comparison} /> : statuses.verifier === "working" && <SkeletonCard color="green" title={t("sec.comparison")} />}
                  {outputs.chief ? <FinalCard data={outputs.chief as Final} /> : statuses.chief === "working" && <SkeletonCard color="red" title={t("sec.final")} />}
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
