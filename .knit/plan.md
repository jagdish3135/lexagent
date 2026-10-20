# LexAgent        Goal: help people understand long Indian legal case documents in minutes, using 4 AI agents that check each other's work.
Users: citizens with no legal background, law students, lawyers and judges (decision support only, never a judgment).

## Stories
- US-1 Landing: a visitor sees what LexAgent does, how the 4 agents work, and a clear "not legal advice" line.
  - Hero + agent pipeline + CTA to sign up; works at 360 px; light/dark toggle.
- US-2 Dummy auth: sign up / log in with any email + password (6+ chars), session kept in localStorage; logout.
  - /dashboard redirects to /login when logged out. A "demo auth" note is visible on the forms.
- US-3 Case input: on the dashboard, upload a PDF, DOCX or TXT (max 10 MB), or paste text, or load a sample case.
  - The extracted text shows in an editable box with its character count; unsupported or empty files show an error.
- US-4 Analyze: "Analyze Case" runs the 4 agents, with live progress for each one (waiting → working → done/failed).
  - Agents 1 and 2 run in parallel on the case; agent 3 compares their output; agent 4 writes the final analysis.
- US-5 Results: four sections (Summary, Legal Insights, Comparison, Final Analysis) render as they finish.
  - Legal Insights lists key facts, arguments, and relevant Indian laws/sections (BNS/IPC, BNSS/CrPC, BSA, Constitution...).
- US-6 Export: one-click download of a graphical PDF report (LexAgent badge header, colored agent bands, laws
  table, timeline, disclaimer + page numbers on every page). Real text, not a screenshot.
- US-7 Any free AI: OpenAI-compatible provider from env vars (Mistral default; Groq/Gemini/OpenRouter work too).
  - No key → demo mode with realistic sample output and a "Demo mode" badge. The key never reaches the browser.

## Look
Calm and trustworthy, like a modern law-library: ink navy + parchment, saffron accent (Indian), one color per agent
(blue Summary, amber Insights, green Comparison, red Final, as in the brief). Serif display font (Fraunces) +
Inter for body. Light and dark with a toggle, visible focus rings, 44 px targets, reduced-motion respected,
skeleton loaders while agents work, empty/error states written in plain language.

## Build
Next.js 15 (App Router, TypeScript), plain CSS with tokens on :root. No database (dummy auth).
- `app/page.tsx` landing · `app/login`, `app/signup` · `app/dashboard` (client) · `app/api/analyze/route.ts`
- `lib/agents.ts` 4 agent prompts + pipeline, each agent returns JSON (one schema per agent, rendered by UI + PDF); `lib/llm.ts` OpenAI-compatible fetch; `lib/demo.ts` demo output
- `lib/extract.ts` browser-side text extraction: pdfjs-dist (PDF), mammoth (DOCX), File.text() (TXT)
- API: POST /api/analyze {text} → NDJSON stream of `{agent, status, output?}` events; input capped by
  MAX_INPUT_CHARS (default 24000), rejects empty / too long; simple per-IP rate limit (in-memory).
- Env: LLM_BASE_URL, LLM_API_KEY, LLM_MODEL, MAX_INPUT_CHARS. `.env.example` documents Mistral/Groq/Gemini.
- PDF: @react-pdf/renderer, lazy-loaded on click. Retry with backoff on 429 (Mistral free = ~1 req/s).
- README: animated SVG banner + pipeline (light/dark `<picture>`), Mermaid diagrams, real screenshots, demo GIF
  + MP4 recorded from the app, collapsible `<details>` sections, badges, live-demo button.

## Tasks
- [ ] T1 Scaffold Next.js, tokens, theme toggle, layout + footer badge (US-1)
- [ ] T2 Landing page (US-1)
- [ ] T3 Dummy auth: login/signup/logout + dashboard guard (US-2)
- [ ] T4 Extraction + case input + sample cases (US-3)
- [ ] T5 LLM client, agent pipeline, demo mode, streaming API route + tests (US-4, US-7)
- [ ] T6 Dashboard progress + result sections (US-4, US-5)
- [ ] T7 Export: graphical PDF with LexAgent badge (US-6)
- [ ] T8 Check: tests, build, browser pass, quality card
- [ ] T9 README with graphics, screenshots, demo GIF/MP4; ship to GitHub + Vercel (on approval)

## Decisions
- Free provider via env. User has a Mistral key → Mistral default (user pastes it into .env.local/Vercel themself); Gemini free tier trains on prompts → warn in README.
- Old binary .doc is not supported (only .docx); the error message says to save it as .docx or PDF.
- Long documents: free tiers have low tokens/minute, so input is capped and the cap is configurable. Chunked
  map-reduce for very long judgments is out of scope for v1.
- Not legal advice: the disclaimer is on the landing page, the dashboard, every report and the export.
- Risk: scanned (image-only) PDFs have no text → clear error; OCR is out of scope for v1.
- User asked: PDF export only (no Markdown), with the LexAgent badge; graphical style chosen.
