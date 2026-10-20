// Animated diagram of the four-agent pipeline. Colors come from CSS tokens, so it follows the theme.
const nodes = [
  { id: "s", x: 166, y: 52, n: "1", name: "Summarizer", tag: "PLAIN SUMMARY", c: "var(--blue)", soft: "var(--blue-soft)" },
  { id: "a", x: 166, y: 268, n: "2", name: "Legal Analyst", tag: "FACTS · LAWS", c: "var(--amber)", soft: "var(--amber-soft)" },
  { id: "v", x: 340, y: 160, n: "3", name: "Cross-Verifier", tag: "COMPARISON", c: "var(--green)", soft: "var(--green-soft)" },
  { id: "c", x: 340, y: 340, n: "4", name: "Chief Analyst", tag: "FINAL ANALYSIS", c: "var(--red)", soft: "var(--red-soft)" },
];

const wires = [
  { d: "M108 205 C 140 205, 130 92, 166 92", c: "var(--blue)", dur: "2.4s", begin: "0s" },
  { d: "M108 225 C 140 225, 130 308, 166 308", c: "var(--amber)", dur: "2.4s", begin: "0.3s" },
  { d: "M316 92 C 360 92, 300 195, 340 195", c: "var(--blue)", dur: "2.2s", begin: "1.2s" },
  { d: "M316 308 C 360 308, 300 210, 340 210", c: "var(--amber)", dur: "2.2s", begin: "1.5s" },
  { d: "M415 240 L 415 340", c: "var(--green)", dur: "1.6s", begin: "2.2s" },
  { d: "M490 380 C 530 380, 520 300, 548 300", c: "var(--red)", dur: "1.8s", begin: "2.8s" },
];

export function FlowGraphic() {
  return (
    <svg className="flow-svg" viewBox="0 0 640 440" role="img" aria-labelledby="flow-title flow-desc">
      <title id="flow-title">How LexAgent analyzes a case</title>
      <desc id="flow-desc">
        The case document goes to the Summarizer and the Legal Analyst in parallel. The Cross-Verifier compares their
        outputs, the Chief Analyst writes the final analysis, and LexAgent produces a PDF report.
      </desc>
      {wires.map((w, i) => (
        <g key={i}>
          <path className="wire" d={w.d} />
          <circle className="flow-dot" r="5" fill={w.c}>
            <animateMotion dur={w.dur} begin={w.begin} repeatCount="indefinite" path={w.d} />
          </circle>
        </g>
      ))}

      <g transform="translate(20 160)">
        <rect className="node" width="88" height="110" rx="12" strokeWidth="1.5" />
        {[40, 54, 68, 82].map((y, i) => (
          <rect key={y} x="16" y={y} width={i === 3 ? 34 : 56} height="6" rx="3" fill="var(--line)" />
        ))}
        <text x="16" y="28" className="t-tag" style={{ fill: "var(--accent-ink)" }}>
          CASE
        </text>
      </g>
      <text x="64" y="296" textAnchor="middle" className="t-tag">
        PDF · DOCX · TXT
      </text>

      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
          <rect className="node" width="150" height="80" rx="14" strokeWidth="1.5" />
          <rect width="150" height="6" rx="3" fill={n.c} />
          <circle cx="28" cy="44" r="15" fill={n.soft} />
          <text x="28" y="49" textAnchor="middle" style={{ font: "800 14px var(--font-body)", fill: n.c }}>
            {n.n}
          </text>
          <text x="50" y="42" className="t-name" style={{ fontSize: 13 }}>
            {n.name}
          </text>
          <text x="50" y="60" className="t-tag" style={{ fontSize: 9.5 }}>
            {n.tag}
          </text>
        </g>
      ))}

      <text x="241" y="200" textAnchor="middle" className="t-tag">
        IN PARALLEL
      </text>
      <path d="M241 140 L241 182 M241 210 L241 262" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 5" />

      <g transform="translate(548 240)">
        <rect width="76" height="96" rx="12" fill="var(--primary)" />
        <text x="38" y="46" textAnchor="middle" style={{ font: "800 18px var(--font-body)", fill: "var(--primary-ink)" }}>
          PDF
        </text>
        <text x="38" y="66" textAnchor="middle" style={{ font: "600 9.5px var(--font-body)", fill: "var(--primary-ink)", opacity: 0.8 }}>
          REPORT
        </text>
      </g>
    </svg>
  );
}
