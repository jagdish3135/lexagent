// Generates the animated README graphics (light + dark): banner, agent pipeline and the roles card.
// Strict black and white, like the site. Usage: node docs/readme/make-svgs.mjs   (writes into docs/readme/)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Helvetica, Arial, 'Nirmala UI', 'Noto Sans Devanagari', sans-serif";
const MONO = "'Cascadia Mono', Consolas, 'SF Mono', Menlo, monospace";

const THEMES = {
  dark: { bg: "#0b0b0b", bg2: "#161616", card: "#121212", line: "#2a2a2a", ink: "#f2f2f2", muted: "#9a9a9a", tint: "#1e1e1e" },
  light: { bg: "#ffffff", bg2: "#f4f4f2", card: "#ffffff", line: "#e2e2e2", ink: "#0b0b0b", muted: "#6b6b6b", tint: "#f1f1ef" },
};

const AGENTS = [
  ["Summarizer", "Plain-language summary"],
  ["Legal Analyst", "Facts · issues · Acts &amp; sections"],
  ["Cross-Verifier", "Agreements · gaps · confidence"],
  ["Chief Analyst", "Final structured analysis"],
];

const esc = (s) => s.replace(/&(?!amp;)/g, "&amp;").replace(/</g, "&lt;");
const kicker = (x, y, text, t, extra = "", color = t.muted) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="12" font-weight="600" letter-spacing="2.6" fill="${color}" ${extra}>${esc(text)}</text>`;

// The site's agent number: an outlined circle with an italic serif numeral.
const numeral = (cx, cy, r, n, t) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t.ink}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy + r * 0.38}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${r * 1.15}" fill="${t.ink}">${n}</text>`;

const mark = (x, y, size, t) => `
  <g transform="translate(${x} ${y}) scale(${size / 64})">
    <rect width="64" height="64" fill="${t.ink}"/>
    <g fill="none" stroke="${t.bg}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 14v34M22 48h20M18 22h28"/><path d="M18 22l-7 14h14zM46 22l-7 14h14z"/>
    </g>
    <circle cx="32" cy="14" r="3.6" fill="${t.bg}"/>
  </g>`;

// Shows a layer only during its slot of an n-slot loop (discrete, so slots switch cleanly).
function slot(i, n, dur) {
  const k = (v) => (v / n).toFixed(4);
  const [values, keyTimes] =
    i === 0 ? ["1;0", `0;${k(1)}`] : i === n - 1 ? ["0;1", `0;${k(i)}`] : ["0;1;0", `0;${k(i)};${k(i + 1)}`];
  return `<animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" calcMode="discrete" dur="${dur}s" repeatCount="indefinite"/>`;
}

function banner(t) {
  const W = 1280, H = 420, cycle = 8;
  const chips = ["BNS · BNSS · BSA aware", "4 cross-checking agents", "PDF export", "Free AI APIs"];
  let cx = 72;
  const chipSvg = chips
    .map((c) => {
      const w = Math.round(c.length * 8.1 + 30);
      const s = `<g transform="translate(${cx} 322)"><rect width="${w}" height="36" fill="${t.card}" stroke="${t.ink}"/><text x="${w / 2}" y="23" text-anchor="middle" font-family="${SANS}" font-size="14.5" font-weight="600" fill="${t.ink}">${esc(c)}</text></g>`;
      cx += w + 12;
      return s;
    })
    .join("");

  // Agent stack: 1 and 2 finish together, then 3, then 4. Loops every `cycle` seconds.
  const doneAt = [2.2, 2.6, 4.4, 6.2];
  const agents = AGENTS.map(([name, out], i) => {
    const y = 78 + i * 70;
    const kt = (doneAt[i] / cycle).toFixed(3);
    return `
    <g transform="translate(850 ${y})">
      <rect width="360" height="58" fill="${t.card}" stroke="${t.line}"/>
      <rect width="4" height="58" fill="${t.ink}"/>
      ${numeral(36, 29, 15, i + 1, t)}
      <text x="62" y="26" font-family="${SANS}" font-size="16" font-weight="700" fill="${t.ink}">${name}</text>
      <text x="62" y="45" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${out}</text>
      <g>
        <text x="328" y="33" text-anchor="end" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="${t.muted}">READING</text>
        <circle cx="340" cy="29" r="4.5" fill="${t.ink}"><animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite"/></circle>
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${kt};${kt};1" dur="${cycle}s" repeatCount="indefinite"/>
      </g>
      <g opacity="0">
        <circle cx="334" cy="29" r="11" fill="${t.ink}"/>
        <path d="M328.5 29.5l4 4 7-8" fill="none" stroke="${t.card}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${kt};${kt};1" dur="${cycle}s" repeatCount="indefinite"/>
      </g>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="LexAgent: multi-agent legal case analysis for Indian law">
  <defs>
    <clipPath id="clip"><rect width="${W}" height="${H}"/></clipPath>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${t.line}"/></pattern>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="${t.bg}"/>
    <rect x="780" y="0" width="500" height="${H}" fill="${t.bg2}"/>
    <rect x="780" y="0" width="500" height="${H}" fill="url(#dots)"/>
    <rect x="0" y="${H - 8}" width="${W}" height="1.5" fill="${t.ink}"/><rect x="0" y="${H - 4}" width="${W}" height="1.5" fill="${t.ink}"/>
  </g>
  ${mark(72, 84, 72, t)}
  <text x="164" y="140" font-family="${SERIF}" font-size="66" fill="${t.ink}">Lex<tspan font-style="italic">Agent</tspan></text>
  ${kicker(166, 176, "MULTI-AGENT LEGAL ANALYSIS · INDIAN LAW", t)}
  <text x="72" y="236" font-family="${SANS}" font-size="22" fill="${t.ink}">Upload a case file. Four AI agents summarize it, find the law,</text>
  <text x="72" y="268" font-family="${SANS}" font-size="22" fill="${t.ink}">check each other's work and hand you a <tspan font-weight="700" text-decoration="underline">PDF brief</tspan> in minutes.</text>
  ${chipSvg}
  ${agents}
</svg>
`;
}

function pipeline(t) {
  const W = 1200, H = 470;
  const node = (x, y, w, h, i) => `<g transform="translate(${x} ${y})">
      <rect width="${w}" height="${h}" fill="${t.card}" stroke="${t.line}" stroke-width="1.5"/>
      <rect width="4" height="${h}" fill="${t.ink}"/>
      ${numeral(34, h / 2, 17, i + 1, t)}
      <text x="62" y="${h / 2 - 1}" font-family="${SANS}" font-size="17" font-weight="700" fill="${t.ink}">${AGENTS[i][0]}</text>
      <text x="62" y="${h / 2 + 19}" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${AGENTS[i][1]}</text>
    </g>`;
  const wire = (d, dur, begin) => `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="2.5"/>
  <circle r="5.5" fill="${t.ink}"><animateMotion dur="${dur}" begin="${begin}" repeatCount="indefinite" path="${d}"/></circle>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="LexAgent pipeline: document to two parallel agents, a cross-verifier, a chief analyst and a PDF report">
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${t.bg}" stroke="${t.ink}" stroke-width="2"/>
  ${wire("M200 235 C 250 235, 250 120, 300 120", "2.2s", "0s")}
  ${wire("M200 235 C 250 235, 250 350, 300 350", "2.2s", "0.25s")}
  ${wire("M560 120 C 610 120, 600 235, 650 235", "2.2s", "1.1s")}
  ${wire("M560 350 C 610 350, 600 235, 650 235", "2.2s", "1.35s")}
  ${wire("M770 275 L770 345", "1.6s", "2.4s")}
  ${wire("M890 385 C 960 385, 950 235, 1010 235", "1.8s", "3s")}

  <g transform="translate(40 160)">
    <rect width="160" height="150" fill="${t.card}" stroke="${t.ink}" stroke-width="1.5"/>
    ${kicker(22, 40, "CASE FILE", t, "", t.ink)}
    ${[58, 76, 94, 112].map((y, i) => `<rect x="22" y="${y}" width="${i === 3 ? 70 : 116}" height="6" fill="${t.line}"/>`).join("")}
    <text x="80" y="176" text-anchor="middle" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${t.muted}">PDF · DOCX · TXT</text>
  </g>

  ${kicker(430, 242, "IN PARALLEL", t, 'text-anchor="middle"')}
  <path d="M430 160 L430 220 M430 255 L430 312" stroke="${t.line}" stroke-width="2" stroke-dasharray="5 6"/>

  ${node(300, 80, 260, 80, 0)}
  ${node(300, 310, 260, 80, 1)}
  ${node(650, 195, 240, 80, 2)}
  ${node(650, 345, 240, 80, 3)}

  <g transform="translate(1010 165)">
    <rect width="150" height="140" fill="${t.ink}"/>
    <text x="75" y="64" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${t.bg}">PDF</text>
    <text x="75" y="92" text-anchor="middle" font-family="${MONO}" font-size="11.5" letter-spacing="2.5" fill="${t.bg}">REPORT</text>
    <text x="75" y="114" text-anchor="middle" font-family="${SANS}" font-size="11" fill="${t.bg}" opacity="0.7">with LexAgent seal</text>
  </g>

  <text x="40" y="58" font-family="${SERIF}" font-size="28" fill="${t.ink}">How a case moves through <tspan font-style="italic">LexAgent</tspan></text>
  <text x="40" y="448" font-family="${SANS}" font-size="13.5" fill="${t.muted}">Each agent's result streams to the dashboard the moment it finishes · decision support only, never a verdict</text>
</svg>
`;
}

// Roles card: the sign-up role picker cycles through the five readers, and the panel shows
// how the Summarizer would open the same cheque-bounce case for each of them.
const ROLES = [
  ["Citizen", ["Plain words, every", "term explained"], [
    "Mr. Patil gave the dealer a cheque for Rs. 4.5 lakh. The bank returned it because there was not enough money.",
    "The law on bounced cheques (Section 138, Negotiable Instruments Act) makes this a crime if he did not pay",
    "within 15 days of a written demand. That demand letter is called a “legal notice”.",
  ]],
  ["Law student", ["Reasoning and", "doctrines named"], [
    "A complaint under s.138 NI Act. With the signature admitted, s.139 presumes the cheque was for a debt;",
    "the accused may rebut it on a preponderance of probabilities (Rangappa v. Sri Mohan, 2010).",
    "The “security cheque” defence goes to that rebuttal, not to the elements of the offence.",
  ]],
  ["Advocate", ["Issues, evidence", "and procedure"], [
    "Issues: (i) a legally enforceable debt, or only security; (ii) service of the demand notice; (iii) limitation.",
    "Evidence to secure: return memo of 17.01.2025, postal tracking for 08.02.2025, ledger and delivery challans.",
    "The notice went to the address printed on the cheque, which the accused admits is his residence.",
  ]],
  ["Judge", ["Neutral, concise,", "on the record"], [
    "Complaint under s.138 NI Act. Dishonour (17.01.2025) and the demand notice (05.02.2025) are on record.",
    "Signature admitted. Non-receipt of notice is pleaded, though the address on the cheque is admitted.",
    "The burden lies on the accused to rebut the presumption under s.139.",
  ]],
  ["Researcher", ["Thorough and", "structured"], [
    "Statute: NI Act ss.118, 138, 139 and 142. Elements, presumptions, notice and limitation set out in order,",
    "with the leading authority (Rangappa v. Sri Mohan, 2010) and the points to check against the record.",
    "Every section cited is listed with the Act it comes from.",
  ]],
];

function roles(t) {
  const W = 1200, H = 500, per = 3, n = ROLES.length, dur = per * n;
  const cw = 212, gap = 15, top = 128, ch = 96;
  const cards = ROLES.map(([name, desc], i) => {
    const x = 40 + i * (cw + gap);
    return `<g transform="translate(${x} ${top})">
      <rect width="${cw}" height="${ch}" fill="${t.card}" stroke="${t.line}"/>
      <g opacity="${i === 0 ? 1 : 0}">
        <rect width="${cw}" height="${ch}" fill="${t.tint}" stroke="${t.ink}" stroke-width="1.5"/>
        <rect width="4" height="${ch}" fill="${t.ink}"/>
        ${slot(i, n, dur)}
      </g>
      <text x="20" y="40" font-family="${SERIF}" font-size="23" fill="${t.ink}">${name}</text>
      <text x="20" y="64" font-family="${SANS}" font-size="13" fill="${t.muted}">${desc[0]}</text>
      <text x="20" y="81" font-family="${SANS}" font-size="13" fill="${t.muted}">${desc[1]}</text>
    </g>`;
  }).join("\n  ");

  const panels = ROLES.map(([name, , lines], i) => `<g opacity="${i === 0 ? 1 : 0}">
      ${kicker(28, 40, `THE SUMMARY · WRITTEN FOR ${name.toUpperCase() === "ADVOCATE" ? "AN" : "A"} ${name.toUpperCase()}`, t)}
      ${lines.map((l, j) => `<text x="28" y="${84 + j * 30}" font-family="${SANS}" font-size="17" fill="${t.ink}">${esc(l)}</text>`).join("\n      ")}
      ${slot(i, n, dur)}
    </g>`).join("\n    ");

  // Progress rule under the panel: fills once per role.
  const progress = `<rect x="0" y="0" height="3" fill="${t.ink}" width="0"><animate attributeName="width" values="0;1064" dur="${per}s" repeatCount="indefinite"/></rect>`;

  const langs = ["EN", "हि", "म"].map((l, i) => {
    const x = W - 40 - 3 * 46 + i * 46;
    return `<rect x="${x}" y="46" width="46" height="36" fill="${i === 0 ? t.ink : t.card}" stroke="${t.ink}"/>
    <text x="${x + 23}" y="69" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="700" fill="${i === 0 ? t.bg : t.ink}">${l}</text>`;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sign-up role picker: Citizen, Law student, Advocate, Judge or Researcher. The agents write the same case differently for each.">
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${t.bg}" stroke="${t.ink}" stroke-width="2"/>
  ${kicker(40, 52, "SIGN UP · I AM A", t)}
  <text x="40" y="94" font-family="${SERIF}" font-size="30" fill="${t.ink}">Five kinds of reader. <tspan font-style="italic">One case file.</tspan></text>
  ${langs}
  ${kicker(W - 40, 104, "OUTPUT LANGUAGE", t, 'text-anchor="end" font-size="10.5"')}

  ${cards}

  <g transform="translate(40 254)">
    <rect width="1120" height="184" fill="${t.card}" stroke="${t.line}"/>
    <g transform="translate(28 181)">${progress}</g>
    ${panels}
  </g>

  <text x="40" y="474" font-family="${SANS}" font-size="13.5" fill="${t.muted}">One cheque-bounce case, five readers: the agents change depth and tone, never the facts · output in English, Hindi or Marathi</text>
</svg>
`;
}

for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(join(here, `banner-${name}.svg`), banner(t));
  writeFileSync(join(here, `pipeline-${name}.svg`), pipeline(t));
  writeFileSync(join(here, `roles-${name}.svg`), roles(t));
}
console.log("wrote banner-*.svg, pipeline-*.svg and roles-*.svg");
