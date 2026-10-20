import { Document, Page, Path, Rect, StyleSheet, Svg, Text, View, Circle } from "@react-pdf/renderer";
import type { AgentOutputs } from "../schemas";

export interface ReportInfo {
  mode: "live" | "demo";
  model: string;
  source: string;
}

const C = {
  navy: "#14213D",
  saffron: "#E07A1F",
  gold: "#F2B661",
  paper: "#F7F3EA",
  ink: "#1F2937",
  muted: "#566074",
  line: "#E2D9C6",
  blue: ["#1D4ED8", "#E6EDFF"],
  amber: ["#A15C00", "#FDF0D5"],
  green: ["#157F3D", "#E3F4E8"],
  red: ["#B42318", "#FDE8E6"],
} as const;

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 60, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 10, color: C.ink, lineHeight: 1.45 },
  band: { marginTop: -36, marginHorizontal: -40, paddingVertical: 22, paddingHorizontal: 40, backgroundColor: C.navy, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center" },
  brandName: { fontFamily: "Times-Bold", fontSize: 22, lineHeight: 1, color: "#FFFFFF", marginLeft: 10 },
  brandSub: { fontFamily: "Helvetica-Bold", fontSize: 7.5, lineHeight: 1, color: C.gold, letterSpacing: 1.6, marginLeft: 10, marginTop: 6 },
  bandMeta: { alignItems: "flex-end" },
  bandMetaText: { color: "#D6DCE8", fontSize: 8.5 },
  saffronRule: { marginHorizontal: -40, height: 4, backgroundColor: C.saffron },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 14 },
  title: { fontFamily: "Times-Bold", fontSize: 19, color: C.navy, lineHeight: 1.2 },
  subtitle: { fontSize: 9.5, color: C.muted, marginTop: 4 },
  seal: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: C.saffron, alignItems: "center", justifyContent: "center", marginLeft: 16 },
  sealIn: { width: 84, height: 84, borderRadius: 42, borderWidth: 0.8, borderColor: C.saffron, alignItems: "center", justifyContent: "center" },
  sealSmall: { fontFamily: "Helvetica-Bold", fontSize: 6.5, color: C.saffron, letterSpacing: 1 },
  sealBig: { fontFamily: "Times-Bold", fontSize: 14, lineHeight: 1.1, color: C.navy, marginVertical: 3 },
  pipeline: { flexDirection: "row", alignItems: "center", backgroundColor: C.paper, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 18 },
  pipeStep: { flexDirection: "row", alignItems: "center", flex: 1 },
  pipeDot: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", marginRight: 6 },
  pipeNum: { color: "#FFFFFF", fontFamily: "Helvetica-Bold", fontSize: 8.5 },
  pipeName: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.ink },
  pipeOut: { fontSize: 7, color: C.muted },
  secHead: { flexDirection: "row", alignItems: "center", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10, marginTop: 8, marginBottom: 10 },
  secNum: { width: 22, height: 22, borderRadius: 5, alignItems: "center", justifyContent: "center", marginRight: 10 },
  secTitle: { fontFamily: "Times-Bold", fontSize: 14, color: C.navy },
  secBy: { fontSize: 7.5, color: C.muted, marginTop: 1 },
  label: { fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 1.1, marginBottom: 5, marginTop: 8 },
  para: { marginBottom: 6 },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletMark: { width: 12, fontFamily: "Helvetica-Bold" },
  bulletText: { flex: 1 },
  cols: { flexDirection: "row" },
  col: { flex: 1 },
  box: { borderWidth: 0.8, borderColor: C.line, borderRadius: 6, padding: 9, backgroundColor: "#FFFFFF" },
  tl: { flexDirection: "row", marginBottom: 4 },
  tlDate: { width: 78, fontFamily: "Helvetica-Bold", fontSize: 8.5, color: C.muted },
  tlDot: { width: 6, height: 6, borderRadius: 3, marginTop: 3, marginRight: 8 },
  table: { borderWidth: 0.8, borderColor: C.line, borderRadius: 6 },
  tr: { flexDirection: "row", borderBottomWidth: 0.8, borderBottomColor: C.line },
  th: { fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 0.8, padding: 6 },
  td: { padding: 6, fontSize: 9 },
  callout: { borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 4, marginBottom: 6 },
  disclaimer: { marginTop: 18, backgroundColor: C.navy, borderRadius: 8, padding: 14 },
  discTitle: { fontFamily: "Times-Bold", fontSize: 12, color: "#FFFFFF", marginBottom: 3 },
  discText: { color: "#D6DCE8", fontSize: 8.5 },
  footRule: { position: "absolute", bottom: 42, left: 40, width: 515.28, height: 0.8, backgroundColor: C.line },
  footPill: { position: "absolute", bottom: 22, left: 40, flexDirection: "row" },
  pillA: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: C.navy, color: "#FFFFFF", fontSize: 7, fontFamily: "Helvetica-Bold", paddingVertical: 3, paddingHorizontal: 5 },
  pillB: { borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: C.gold, color: C.navy, fontSize: 7, fontFamily: "Helvetica-Bold", paddingVertical: 3, paddingHorizontal: 5 },
  footText: { position: "absolute", bottom: 24, fontSize: 7.5, color: C.muted },
});

function Mark({ size = 30, tile = C.navy, ink = C.gold }: { size?: number; tile?: string; ink?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="0" y="0" width="64" height="64" rx="16" fill={tile} />
      <Path d="M32 14v34M22 48h20M18 22h28" stroke={ink} strokeWidth={3.6} strokeLinecap="round" />
      <Path d="M18 22l-7 14h14zM46 22l-7 14h14z" stroke={ink} strokeWidth={3.6} strokeLinejoin="round" fill="none" />
      <Circle cx="32" cy="14" r="3.4" fill={ink} />
    </Svg>
  );
}

const Bullets = ({ items, color, ordered }: { items: string[]; color: string; ordered?: boolean }) =>
  items.length === 0 ? (
    <Text style={{ color: C.muted }}>None noted.</Text>
  ) : (
    <View>
      {items.map((t, i) => (
        <View key={i} style={s.bullet} wrap={false}>
          <Text style={[s.bulletMark, { color }]}>{ordered ? `${i + 1}.` : "•"}</Text>
          <Text style={s.bulletText}>{t}</Text>
        </View>
      ))}
    </View>
  );

function SectionHead({ n, title, agent, color }: { n: number; title: string; agent: string; color: readonly [string, string] }) {
  return (
    <View style={[s.secHead, { backgroundColor: color[1] }]} minPresenceAhead={90} wrap={false}>
      <View style={[s.secNum, { backgroundColor: color[0] }]}>
        <Text style={s.pipeNum}>{n}</Text>
      </View>
      <View>
        <Text style={s.secTitle}>{title}</Text>
        <Text style={s.secBy}>by the {agent} agent</Text>
      </View>
    </View>
  );
}

const Label = ({ children, color }: { children: string; color: string }) => <Text style={[s.label, { color }]}>{children.toUpperCase()}</Text>;

const STEPS = [
  { name: "Summarizer", out: "Summary", c: C.blue[0] },
  { name: "Legal Analyst", out: "Legal insights", c: C.amber[0] },
  { name: "Cross-Verifier", out: "Comparison", c: C.green[0] },
  { name: "Chief Analyst", out: "Final analysis", c: C.red[0] },
];

export function ReportDoc({ outputs, info, date }: { outputs: AgentOutputs; info: ReportInfo; date: string }) {
  const { summarizer: sum, analyst: ins, verifier: ver, chief: fin } = outputs;
  return (
    <Document title={`LexAgent report - ${sum?.title ?? "Case analysis"}`} author="LexAgent" creator="LexAgent" subject="AI case analysis report">
      <Page size="A4" style={s.page}>
        <View style={s.footRule} fixed />
        <View style={s.footPill} fixed>
          <Text style={s.pillA}>analyzed by</Text>
          <Text style={s.pillB}>LexAgent</Text>
        </View>
        <Text style={[s.footText, { left: 160 }]} fixed>
          Decision support only · not legal advice
        </Text>
        {/* Page numbers use a View render prop: an absolutely positioned render-prop Text is dropped by react-pdf. */}
        <View
          style={{ position: "absolute", bottom: 22, left: 455, width: 100, height: 14 }}
          fixed
          render={(props) => {
            // react-pdf passes totalPages to View render props too; its types only list pageNumber.
            const { pageNumber, totalPages } = props as typeof props & { totalPages: number };
            return <Text style={{ fontSize: 7.5, lineHeight: 1, color: C.muted, textAlign: "right" }}>{`Page ${pageNumber} of ${totalPages}`}</Text>;
          }}
        />
        <View style={s.band}>
          <View style={s.brand}>
            <Mark size={38} tile="#1E2D52" />
            <View>
              <Text style={s.brandName}>LexAgent</Text>
              <Text style={s.brandSub}>AI CASE ANALYSIS REPORT</Text>
            </View>
          </View>
          <View style={s.bandMeta}>
            <Text style={s.bandMetaText}>Generated {date}</Text>
            <Text style={s.bandMetaText}>{info.mode === "live" ? `Live AI · ${info.model}` : "Demo mode · sample analysis"}</Text>
            <Text style={s.bandMetaText}>Source: {info.source}</Text>
          </View>
        </View>
        <View style={s.saffronRule} />

        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{sum?.title || "Case analysis"}</Text>
            <Text style={s.subtitle}>{[sum?.caseType, sum?.court].filter(Boolean).join("  ·  ")}</Text>
          </View>
          <View style={s.seal}>
            <View style={s.sealIn}>
              <Text style={s.sealSmall}>LEXAGENT</Text>
              <Text style={s.sealBig}>4 AGENTS</Text>
              <Text style={s.sealSmall}>{(ver?.confidence ?? "—").toUpperCase()}</Text>
              <Text style={s.sealSmall}>CONFIDENCE</Text>
            </View>
          </View>
        </View>

        <View style={s.pipeline}>
          {STEPS.map((st, i) => (
            <View key={st.name} style={s.pipeStep}>
              <View style={[s.pipeDot, { backgroundColor: st.c }]}>
                <Text style={s.pipeNum}>{i + 1}</Text>
              </View>
              <View>
                <Text style={s.pipeName}>{st.name}</Text>
                <Text style={s.pipeOut}>{st.out}</Text>
              </View>
            </View>
          ))}
        </View>

        {sum && (
          <View>
            <SectionHead n={1} title="Summary" agent="Summarizer" color={C.blue} />
            {sum.plainSummary.map((p, i) => (
              <Text key={i} style={s.para}>
                {p}
              </Text>
            ))}
            <View style={[s.cols, { marginTop: 4 }]} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                <Label color={C.blue[0]}>Parties</Label>
                {sum.parties.map((p, i) => (
                  <View key={i} style={{ marginBottom: 4 }} wrap={false}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>{p.name}</Text>
                    <Text style={{ color: C.muted, fontSize: 8.5 }}>{p.role}</Text>
                  </View>
                ))}
              </View>
              <View style={[s.col, { flex: 1.4 }]}>
                <Label color={C.blue[0]}>Timeline</Label>
                {sum.timeline.map((t, i) => (
                  <View key={i} style={s.tl} wrap={false}>
                    <Text style={s.tlDate}>{t.date}</Text>
                    <View style={[s.tlDot, { backgroundColor: C.blue[0] }]} />
                    <Text style={{ flex: 1 }}>{t.event}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {ins && (
          <View>
            <SectionHead n={2} title="Legal Insights" agent="Legal Analyst" color={C.amber} />
            <View style={s.cols}>
              <View style={[s.col, { marginRight: 12 }]}>
                <Label color={C.amber[0]}>Key facts</Label>
                <Bullets items={ins.keyFacts} color={C.amber[0]} />
              </View>
              <View style={s.col}>
                <Label color={C.amber[0]}>Issues for the court</Label>
                <Bullets items={ins.issues} color={C.amber[0]} />
              </View>
            </View>
            <Label color={C.amber[0]}>Arguments</Label>
            <View style={s.cols} wrap={false}>
              {ins.arguments.slice(0, 3).map((a, i, arr) => (
                <View key={i} style={[s.col, s.box, { marginRight: i < arr.length - 1 ? 8 : 0 }]}>
                  <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 4 }}>{a.side}</Text>
                  <Bullets items={a.points} color={C.amber[0]} />
                </View>
              ))}
            </View>
            <Label color={C.amber[0]}>Relevant laws</Label>
            <View style={s.table}>
              <View style={[s.tr, { backgroundColor: C.amber[1] }]} wrap={false}>
                <Text style={[s.th, { width: "34%" }]}>ACT</Text>
                <Text style={[s.th, { width: "18%" }]}>SECTION</Text>
                <Text style={[s.th, { width: "48%" }]}>WHY IT MATTERS</Text>
              </View>
              {ins.laws.map((l, i) => (
                <View key={i} style={[s.tr, i === ins.laws.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
                  <Text style={[s.td, { width: "34%" }]}>{l.law}</Text>
                  <Text style={[s.td, { width: "18%", fontFamily: "Helvetica-Bold" }]}>{l.section}</Text>
                  <Text style={[s.td, { width: "48%" }]}>{l.relevance}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {ver && (
          <View>
            <SectionHead n={3} title="Comparison" agent="Cross-Verifier" color={C.green} />
            <View style={[s.box, { flexDirection: "row", alignItems: "center", marginBottom: 4 }]} wrap={false}>
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={{ width: 16, height: 6, borderRadius: 3, marginRight: 3, backgroundColor: i <= ({ Low: 1, Medium: 2, High: 3 } as const)[ver.confidence] ? C.green[0] : C.line }}
                  />
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{ver.confidence} confidence</Text>
                <Text style={{ color: C.muted, fontSize: 8.5 }}>{ver.confidenceNote}</Text>
              </View>
            </View>
            <View style={s.cols} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                <Label color={C.green[0]}>Agents agree</Label>
                <Bullets items={ver.agreements} color={C.green[0]} />
              </View>
              <View style={s.col}>
                <Label color={C.green[0]}>Differences</Label>
                <Bullets items={ver.differences} color={C.green[0]} />
              </View>
            </View>
            <Label color={C.red[0]}>Inconsistencies</Label>
            {ver.inconsistencies.length ? (
              <Bullets items={ver.inconsistencies} color={C.red[0]} />
            ) : (
              <Text style={{ color: C.muted }}>No inconsistencies found between the two readings.</Text>
            )}
          </View>
        )}

        {fin && (
          <View>
            <SectionHead n={4} title="Final Analysis" agent="Chief Analyst" color={C.red} />
            <View style={[s.callout, { borderLeftColor: C.red[0] }]}>
              <Text style={{ fontSize: 10.5 }}>{fin.overview}</Text>
            </View>
            <Label color={C.red[0]}>Key findings</Label>
            <Bullets items={fin.keyFindings} color={C.red[0]} />
            <View style={[s.cols, { marginTop: 8 }]}>
              {fin.sides.slice(0, 3).map((side, i, arr) => (
                <View key={i} style={[s.col, s.box, { marginRight: i < arr.length - 1 ? 8 : 0 }]} wrap={false}>
                  <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 3 }}>{side.side}</Text>
                  <Text style={[s.label, { color: C.green[0], marginTop: 2 }]}>STRENGTHS</Text>
                  <Bullets items={side.strengths} color={C.green[0]} />
                  <Text style={[s.label, { color: C.red[0] }]}>WEAKNESSES</Text>
                  <Bullets items={side.weaknesses} color={C.red[0]} />
                </View>
              ))}
            </View>
            <View style={s.cols} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                <Label color={C.red[0]}>Open questions</Label>
                <Bullets items={fin.openQuestions} color={C.red[0]} />
              </View>
              <View style={s.col}>
                <Label color={C.red[0]}>Suggested next steps</Label>
                <Bullets items={fin.nextSteps} color={C.red[0]} ordered />
              </View>
            </View>
          </View>
        )}

        <View style={s.disclaimer} wrap={false}>
          <Text style={s.discTitle}>Decision support, not a decision</Text>
          <Text style={s.discText}>
            This report was generated by AI agents to help you understand the case document. It is not a judgment, not legal
            advice, and may contain errors. Verify every Act, section and fact against the original record, and consult a
            qualified advocate before acting on it.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
