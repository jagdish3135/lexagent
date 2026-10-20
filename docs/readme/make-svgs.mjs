// Generates the animated README graphics (light + dark): banner and agent pipeline.
// Usage: node docs/readme/make-svgs.mjs   (writes into docs/readme/)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

const THEMES = {
  dark: {
    bg: "#0b1220", bg2: "#121a2b", card: "#121a2b", line: "#26324b", ink: "#ede7da", muted: "#a3acbd",
    accent: "#f2b661", tile: "#1e2d52", tileInk: "#f2b661", chip: "#19243a",
    agents: [["#8db2ff", "#16264a"], ["#f7c35c", "#2e2512"], ["#6bd99a", "#12301f"], ["#ff8a7a", "#3a1714"]],
  },
  light: {
    bg: "#f7f3ea", bg2: "#efe7d6", card: "#ffffff", line: "#e2d9c6", ink: "#14213d", muted: "#566074",
    accent: "#c2630f", tile: "#14213d", tileInk: "#f2b661", chip: "#ffffff",
    agents: [["#1d4ed8", "#e6edff"], ["#a15c00", "#fdf0d5"], ["#157f3d", "#e3f4e8"], ["#b42318", "#fde8e6"]],
  },
};

const AGENTS = [
  ["Summarizer", "Plain-language summary"],
  ["Legal Analyst", "Facts · issues · Acts & sections"],
  ["Cross-Verifier", "Agreements · gaps · confidence"],
  ["Chief Analyst", "Final structured analysis"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const mark = (x, y, size, t) => `
  <g transform="translate(${x} ${y}) scale(${size / 64})">
    <rect width="64" height="64" rx="16" fill="${t.tile}"/>
    <g fill="none" stroke="${t.tileInk}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 14v34M22 48h20M18 22h28"/><path d="M18 22l-7 14h14zM46 22l-7 14h14z"/>
    </g>
    <circle cx="32" cy="14" r="3.4" fill="${t.tileInk}"/>
  </g>`;

function banner(t) {
  const W = 1280, H = 420, cycle = 8;
  const chips = ["BNS · BNSS · BSA aware", "4 cross-checking agents", "PDF export", "Free AI APIs"];
  let cx = 72;
  const chipSvg = chips
    .map((c) => {
      const w = Math.round(c.length * 8.1 + 30);
      const s = `<g transform="translate(${cx} 322)"><rect width="${w}" height="36" rx="18" fill="${t.chip}" stroke="${t.line}"/><text x="${w / 2}" y="23" text-anchor="middle" font-family="${SANS}" font-size="14.5" font-weight="600" fill="${t.ink}">${esc(c)}</text></g>`;
      cx += w + 12;
      return s;
    })
    .join("");

  // Agent stack on the right: 1 and 2 finish together, then 3, then 4. Loops every `cycle` seconds.
  const doneAt = [2.2, 2.6, 4.4, 6.2];
  const agents = AGENTS.map(([name, out], i) => {
    const [c, soft] = t.agents[i];
    const y = 78 + i * 70;
    const kt = (doneAt[i] / cycle).toFixed(3);
    return `
    <g transform="translate(850 ${y})">
      <rect width="360" height="58" rx="14" fill="${t.card}" stroke="${t.line}"/>
      <rect width="6" height="58" rx="3" fill="${c}"/>
      <circle cx="36" cy="29" r="15" fill="${soft}"/>
      <text x="36" y="34" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="800" fill="${c}">${i + 1}</text>
      <text x="62" y="26" font-family="${SANS}" font-size="16" font-weight="700" fill="${t.ink}">${name}</text>
      <text x="62" y="45" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${esc(out)}</text>
      <g>
        <circle cx="330" cy="29" r="6" fill="${c}">
          <animate attributeName="opacity" values="1;0.25;1" dur="1s" repeatCount="indefinite"/>
        </circle>
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${kt};${kt};1" dur="${cycle}s" repeatCount="indefinite"/>
      </g>
      <g opacity="0">
        <circle cx="330" cy="29" r="11" fill="${c}"/>
        <path d="M324.5 29.5l4 4 7-8" fill="none" stroke="${t.card}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${kt};${kt};1" dur="${cycle}s" repeatCount="indefinite"/>
      </g>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="LexAgent: multi-agent legal case analysis for Indian law">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${t.line}"/></pattern>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="780" y="0" width="500" height="${H}" fill="url(#dots)" opacity="0.7"/>
    <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${t.accent}" opacity="0.9"/>
  </g>
  ${mark(72, 84, 72, t)}
  <text x="164" y="140" font-family="${SERIF}" font-size="62" font-weight="700" fill="${t.ink}">LexAgent</text>
  <text x="166" y="176" font-family="${SANS}" font-size="15" font-weight="700" letter-spacing="3" fill="${t.accent}">MULTI-AGENT LEGAL ANALYSIS · INDIAN LAW</text>
  <text x="72" y="236" font-family="${SANS}" font-size="22" fill="${t.ink}">Upload a case file. Four AI agents summarize it, find the law,</text>
  <text x="72" y="268" font-family="${SANS}" font-size="22" fill="${t.ink}">check each other's work and hand you a <tspan font-weight="700" fill="${t.accent}">PDF brief</tspan> in minutes.</text>
  ${chipSvg}
  ${agents}
</svg>
`;
}

function pipeline(t) {
  const W = 1200, H = 470;
  const node = (x, y, w, h, i, title, sub) => {
    const [c, soft] = t.agents[i];
    return `<g transform="translate(${x} ${y})">
      <rect width="${w}" height="${h}" rx="16" fill="${t.card}" stroke="${t.line}" stroke-width="1.5"/>
      <rect width="${w}" height="7" rx="3.5" fill="${c}"/>
      <circle cx="34" cy="${h / 2 + 3}" r="17" fill="${soft}"/>
      <text x="34" y="${h / 2 + 9}" text-anchor="middle" font-family="${SANS}" font-size="16" font-weight="800" fill="${c}">${i + 1}</text>
      <text x="62" y="${h / 2 - 1}" font-family="${SANS}" font-size="17" font-weight="700" fill="${t.ink}">${title}</text>
      <text x="62" y="${h / 2 + 19}" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${esc(sub)}</text>
    </g>`;
  };
  const wires = [
    ["M200 235 C 250 235, 250 120, 300 120", 0, "0s"],
    ["M200 235 C 250 235, 250 350, 300 350", 1, "0.25s"],
    ["M560 120 C 610 120, 600 235, 650 235", 0, "1.1s"],
    ["M560 350 C 610 350, 600 235, 650 235", 1, "1.35s"],
  ];
  const wireSvg = wires
    .map(([d, i, begin]) => `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="2.5"/>
    <circle r="6" fill="${t.agents[i][0]}"><animateMotion dur="2.2s" begin="${begin}" repeatCount="indefinite" path="${d}"/></circle>`)
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="LexAgent pipeline: document to two parallel agents, a cross-verifier, a chief analyst and a PDF report">
  <rect width="${W}" height="${H}" rx="24" fill="${t.bg}"/>
  ${wireSvg}

  <g transform="translate(40 160)">
    <rect width="160" height="150" rx="16" fill="${t.card}" stroke="${t.line}" stroke-width="1.5"/>
    <text x="22" y="40" font-family="${SANS}" font-size="13" font-weight="800" letter-spacing="2" fill="${t.accent}">CASE FILE</text>
    ${[58, 76, 94, 112].map((y, i) => `<rect x="22" y="${y}" width="${i === 3 ? 70 : 116}" height="8" rx="4" fill="${t.line}"/>`).join("")}
    <text x="80" y="176" text-anchor="middle" font-family="${SANS}" font-size="12.5" font-weight="600" fill="${t.muted}">PDF · DOCX · TXT</text>
  </g>

  <text x="430" y="242" text-anchor="middle" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="2.5" fill="${t.muted}">IN PARALLEL</text>
  <path d="M430 160 L430 220 M430 255 L430 312" stroke="${t.line}" stroke-width="2" stroke-dasharray="5 6"/>

  ${node(300, 80, 260, 80, 0, AGENTS[0][0], AGENTS[0][1])}
  ${node(300, 310, 260, 80, 1, AGENTS[1][0], AGENTS[1][1])}
  ${node(650, 195, 240, 80, 2, AGENTS[2][0], AGENTS[2][1])}
  <path d="M770 275 L770 345" fill="none" stroke="${t.line}" stroke-width="2.5"/>
  <circle r="6" fill="${t.agents[2][0]}"><animateMotion dur="1.6s" begin="2.4s" repeatCount="indefinite" path="M770 275 L770 345"/></circle>
  ${node(650, 345, 240, 80, 3, AGENTS[3][0], AGENTS[3][1])}
  <path d="M890 385 C 960 385, 950 235, 1010 235" fill="none" stroke="${t.line}" stroke-width="2.5"/>
  <circle r="6" fill="${t.agents[3][0]}"><animateMotion dur="1.8s" begin="3s" repeatCount="indefinite" path="M890 385 C 960 385, 950 235, 1010 235"/></circle>

  <g transform="translate(1010 165)">
    <rect width="150" height="140" rx="16" fill="${t.tile}"/>
    <text x="75" y="64" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="800" fill="${t.tileInk}">PDF</text>
    <text x="75" y="92" text-anchor="middle" font-family="${SANS}" font-size="12.5" font-weight="700" letter-spacing="2" fill="#ffffff" opacity="0.85">REPORT</text>
    <text x="75" y="114" text-anchor="middle" font-family="${SANS}" font-size="11" fill="#ffffff" opacity="0.6">with LexAgent badge</text>
  </g>

  <text x="40" y="58" font-family="${SERIF}" font-size="26" font-weight="700" fill="${t.ink}">How a case moves through LexAgent</text>
  <text x="40" y="448" font-family="${SANS}" font-size="13.5" fill="${t.muted}">Each agent's result streams to the dashboard the moment it finishes · decision support only, never a verdict</text>
</svg>
`;
}

for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(join(here, `banner-${name}.svg`), banner(t));
  writeFileSync(join(here, `pipeline-${name}.svg`), pipeline(t));
}
console.log("wrote banner-*.svg and pipeline-*.svg");
