import { Circle, Document, Font, Page, Path, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import { translator, type Key } from "../i18n";
import type { Lang } from "../locale";
import type { Style } from "@react-pdf/types";
import type { AgentOutputs } from "../schemas";

export interface ReportInfo {
  mode: "live" | "demo";
  model: string;
  source: string;
  lang: Lang;
}

const C = {
  band: "#0B4F53",
  coral: "#E5674E",
  paper: "#F3F7F7",
  ink: "#0F2A2E",
  muted: "#587073",
  line: "#CDDDDD",
  onBand: "#EAF6F5",
  blue: ["#2F5BD3", "#E3EAFB"],
  amber: ["#A8690F", "#F8ECD2"],
  green: ["#2D7D4F", "#DDF0E3"],
  red: ["#C2412D", "#FBE3DD"],
} as const;

// English uses the built-in PDF fonts. Hindi and Marathi need an embedded Devanagari font.
const LATIN = { body: "Helvetica", bold: "Helvetica-Bold", serif: "Times-Bold", spacing: 1 };
const DEVA = { body: "NotoDeva", bold: "NotoDevaBold", serif: "NotoDevaBold", spacing: 0 };

let registered = false;
/** Registers the Devanagari font files (a URL in the browser, a file path in Node) and turns off hyphenation. */
export function registerFonts(base: string) {
  if (registered) return;
  registered = true;
  Font.register({ family: "NotoDeva", src: `${base}/NotoSansDevanagari-Regular.ttf` });
  Font.register({ family: "NotoDevaBold", src: `${base}/NotoSansDevanagari-Bold.ttf` });
  // Hyphenation splits words mid-way ("presump-tion") and breaks Devanagari clusters.
  Font.registerHyphenationCallback((word) => [word]);
}

function makeStyles(F: typeof LATIN) {
  return StyleSheet.create({
    page: { paddingTop: 36, paddingBottom: 60, paddingHorizontal: 40, fontFamily: F.body, fontSize: 10, color: C.ink, lineHeight: 1.45 },
    band: { marginTop: -36, marginHorizontal: -40, paddingVertical: 22, paddingHorizontal: 40, backgroundColor: C.band, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    brand: { flexDirection: "row", alignItems: "center" },
    brandName: { fontFamily: "Times-Bold", fontSize: 22, lineHeight: 1, color: "#FFFFFF", marginLeft: 10 },
    brandSub: { fontFamily: F.bold, fontSize: 7.5, lineHeight: 1.2, color: "#FF9C86", letterSpacing: 1.6 * F.spacing, marginLeft: 10, marginTop: 6 },
    bandMeta: { alignItems: "flex-end" },
    bandMetaText: { color: C.onBand, fontSize: 8.5 },
    coralRule: { marginHorizontal: -40, height: 4, backgroundColor: C.coral },
    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 14 },
    title: { fontFamily: F.serif, fontSize: 19, color: C.band, lineHeight: 1.25 },
    subtitle: { fontSize: 9.5, color: C.muted, marginTop: 4 },
    seal: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: C.coral, alignItems: "center", justifyContent: "center", marginLeft: 16 },
    sealIn: { width: 84, height: 84, borderRadius: 42, borderWidth: 0.8, borderColor: C.coral, alignItems: "center", justifyContent: "center" },
    sealSmall: { fontFamily: F.bold, fontSize: 6.5, color: C.coral, letterSpacing: 1 * F.spacing },
    sealBig: { fontFamily: F.serif, fontSize: 14, lineHeight: 1.1, color: C.band, marginVertical: 3 },
    pipeline: { flexDirection: "row", alignItems: "center", backgroundColor: C.paper, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 18 },
    pipeStep: { flexDirection: "row", alignItems: "center", flex: 1 },
    pipeDot: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", marginRight: 6 },
    pipeNum: { color: "#FFFFFF", fontFamily: "Helvetica-Bold", fontSize: 8.5 },
    pipeName: { fontFamily: F.bold, fontSize: 8, color: C.ink },
    pipeOut: { fontSize: 7, color: C.muted },
    secHead: { flexDirection: "row", alignItems: "center", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10, marginTop: 8, marginBottom: 10 },
    secNum: { width: 22, height: 22, borderRadius: 5, alignItems: "center", justifyContent: "center", marginRight: 10 },
    secTitle: { fontFamily: F.serif, fontSize: 14, color: C.band },
    secBy: { fontSize: 7.5, color: C.muted, marginTop: 1 },
    label: { fontFamily: F.bold, fontSize: 7.5, letterSpacing: 1.1 * F.spacing, marginBottom: 5, marginTop: 8 },
    para: { marginBottom: 6 },
    bullet: { flexDirection: "row", marginBottom: 3 },
    bulletMark: { width: 12, fontFamily: "Helvetica-Bold" },
    bulletText: { flex: 1 },
    bold: { fontFamily: F.bold },
    cols: { flexDirection: "row" },
    col: { flex: 1 },
    box: { borderWidth: 0.8, borderColor: C.line, borderRadius: 6, padding: 9, backgroundColor: "#FFFFFF" },
    tl: { flexDirection: "row", marginBottom: 4 },
    tlDate: { width: 78, fontFamily: F.bold, fontSize: 8.5, color: C.muted },
    tlDot: { width: 6, height: 6, borderRadius: 3, marginTop: 3, marginRight: 8 },
    table: { borderWidth: 0.8, borderColor: C.line, borderRadius: 6 },
    tr: { flexDirection: "row", borderBottomWidth: 0.8, borderBottomColor: C.line },
    th: { fontFamily: F.bold, fontSize: 7.5, letterSpacing: 0.8 * F.spacing, padding: 6 },
    td: { padding: 6, fontSize: 9 },
    callout: { borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 4, marginBottom: 6 },
    disclaimer: { marginTop: 18, backgroundColor: C.band, borderRadius: 8, padding: 14 },
    discTitle: { fontFamily: F.serif, fontSize: 12, color: "#FFFFFF", marginBottom: 3 },
    discText: { color: C.onBand, fontSize: 8.5 },
    footRule: { position: "absolute", bottom: 42, left: 40, width: 515.28, height: 0.8, backgroundColor: C.line },
    footPill: { position: "absolute", bottom: 22, left: 40, flexDirection: "row" },
    pillA: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: C.band, color: "#FFFFFF", fontSize: 7, fontFamily: F.bold, paddingVertical: 3, paddingHorizontal: 5 },
    pillB: { borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: C.coral, color: "#FFFFFF", fontSize: 7, fontFamily: "Helvetica-Bold", paddingVertical: 3, paddingHorizontal: 5 },
    footText: { position: "absolute", bottom: 24, fontSize: 7.5, color: C.muted },
  });
}

function Mark({ size = 30 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="0" y="0" width="64" height="64" fill="#0E6A6F" />
      <Path d="M32 14v34M22 48h20M18 22h28" stroke="#FFFFFF" strokeWidth={3.6} strokeLinecap="round" />
      <Path d="M18 22l-7 14h14zM46 22l-7 14h14z" stroke="#FFFFFF" strokeWidth={3.6} strokeLinejoin="round" fill="none" />
      <Circle cx="32" cy="14" r="3.6" fill={C.coral} />
    </Svg>
  );
}

export function ReportDoc({ outputs, info, date }: { outputs: AgentOutputs; info: ReportInfo; date: string }) {
  const { summarizer: sum, analyst: ins, verifier: ver, chief: fin } = outputs;
  const F = info.lang === "en" ? LATIN : DEVA;
  const s = makeStyles(F);
  const t = translator(info.lang);
  const up = (k: Key) => (info.lang === "en" ? t(k).toUpperCase() : t(k));

  // react-pdf misplaces line breaks inside Devanagari words (and can drop the last characters of a line),
  // so Hindi/Marathi text is laid out word by word in a wrapping row. English keeps normal text layout.
  const deva = info.lang !== "en";
  const tx = (text: string, style: Style = {}, box: Style = {}, fontSize = 10) =>
    deva ? (
      <View style={[{ flexDirection: "row", flexWrap: "wrap" }, box]}>
        {text
          .split(/\s+/)
          .filter(Boolean)
          .map((w, i) => (
            <Text key={i} style={[style, { marginRight: fontSize * 0.27 }]}>
              {w}
            </Text>
          ))}
      </View>
    ) : (
      <Text style={[style, box]}>{text}</Text>
    );

  // Plain render helpers (not components), called as functions below.
  const bullets = (items: string[], color: string, ordered = false) =>
    items.length === 0 ? (
      tx(t("r.none"), { color: C.muted })
    ) : (
      <View>
        {items.map((x, i) => (
          <View key={i} style={s.bullet} wrap={false}>
            <Text style={[s.bulletMark, { color }]}>{ordered ? `${i + 1}.` : "•"}</Text>
            {tx(x, {}, s.bulletText)}
          </View>
        ))}
      </View>
    );

  const sectionHead = (n: number, title: Key, agent: Key, color: readonly [string, string]) => (
    <View style={[s.secHead, { backgroundColor: color[1] }]} minPresenceAhead={90} wrap={false}>
      <View style={[s.secNum, { backgroundColor: color[0] }]}>
        <Text style={s.pipeNum}>{n}</Text>
      </View>
      <View>
        <Text style={s.secTitle}>{t(title)}</Text>
        <Text style={s.secBy}>{t("sec.by", { agent: t(agent) })}</Text>
      </View>
    </View>
  );

  const label = (k: Key, color: string, marginTop = 8) => <Text style={[s.label, { color, marginTop }]}>{up(k)}</Text>;

  const STEPS = [
    { name: t("agent.summarizer"), out: t("sec.summary"), c: C.blue[0] },
    { name: t("agent.analyst"), out: t("sec.insights"), c: C.amber[0] },
    { name: t("agent.verifier"), out: t("sec.comparison"), c: C.green[0] },
    { name: t("agent.chief"), out: t("sec.final"), c: C.red[0] },
  ];

  return (
    <Document title={`LexAgent - ${sum?.title ?? "Case analysis"}`} author="LexAgent" creator="LexAgent" subject={t("pdf.title")} language={info.lang}>
      <Page size="A4" style={s.page}>
        <View style={s.footRule} fixed />
        <View style={s.footPill} fixed>
          <Text style={s.pillA}>{t("pdf.analyzedBy")}</Text>
          <Text style={s.pillB}>LexAgent</Text>
        </View>
        <Text style={[s.footText, { left: 165 }]} fixed>
          {t("pdf.footer")}
        </Text>
        {/* Page numbers use a View render prop: an absolutely positioned render-prop Text is dropped by react-pdf. */}
        <View
          style={{ position: "absolute", bottom: 22, left: 435, width: 120, height: 16 }}
          fixed
          render={(props) => {
            // react-pdf passes totalPages to View render props too; its types only list pageNumber.
            const { pageNumber, totalPages } = props as typeof props & { totalPages: number };
            return <Text style={{ fontSize: 7.5, lineHeight: 1, color: C.muted, textAlign: "right" }}>{t("pdf.page", { n: pageNumber, total: totalPages })}</Text>;
          }}
        />
        <View style={s.band}>
          <View style={s.brand}>
            <Mark size={38} />
            <View>
              <Text style={s.brandName}>LexAgent</Text>
              <Text style={s.brandSub}>{up("pdf.title")}</Text>
            </View>
          </View>
          <View style={s.bandMeta}>
            <Text style={s.bandMetaText}>{t("pdf.generated", { date })}</Text>
            <Text style={s.bandMetaText}>{info.mode === "live" ? t("mode.live", { model: info.model }) : t("mode.demo")}</Text>
            <Text style={s.bandMetaText}>{t("pdf.source", { source: info.source || t("pdf.pasted") })}</Text>
          </View>
        </View>
        <View style={s.coralRule} />

        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            {tx(sum?.title || t("r.caseSummary"), s.title, {}, 19)}
            {tx([sum?.caseType, sum?.court].filter(Boolean).join("  ·  "), s.subtitle, { marginTop: 4 }, 9.5)}
          </View>
          <View style={s.seal}>
            <View style={s.sealIn}>
              <Text style={s.sealSmall}>LEXAGENT</Text>
              <Text style={s.sealBig}>{up("pdf.agents")}</Text>
              <Text style={s.sealSmall}>{ver ? up(`r.${ver.confidence}`) : "—"}</Text>
              <Text style={s.sealSmall}>{up("pdf.confidence")}</Text>
            </View>
          </View>
        </View>

        <View style={s.pipeline}>
          {STEPS.map((st, i) => (
            <View key={i} style={s.pipeStep}>
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
            {sectionHead(1, "sec.summary", "agent.summarizer", C.blue)}
            {sum.plainSummary.map((p, i) => (
              <View key={i}>{tx(p, {}, s.para)}</View>
            ))}
            <View style={[s.cols, { marginTop: 4 }]} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                {label("r.parties", C.blue[0])}
                {sum.parties.map((p, i) => (
                  <View key={i} style={{ marginBottom: 4 }} wrap={false}>
                    {tx(p.name, s.bold)}
                    {tx(p.role, { color: C.muted, fontSize: 8.5 }, {}, 8.5)}
                  </View>
                ))}
              </View>
              <View style={[s.col, { flex: 1.4 }]}>
                {label("r.timeline", C.blue[0])}
                {sum.timeline.map((ev, i) => (
                  <View key={i} style={s.tl} wrap={false}>
                    <Text style={s.tlDate}>{ev.date}</Text>
                    <View style={[s.tlDot, { backgroundColor: C.blue[0] }]} />
                    {tx(ev.event, {}, { flex: 1 })}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {ins && (
          <View>
            {sectionHead(2, "sec.insights", "agent.analyst", C.amber)}
            <View style={s.cols}>
              <View style={[s.col, { marginRight: 12 }]}>
                {label("r.facts", C.amber[0])}
                {bullets(ins.keyFacts, C.amber[0])}
              </View>
              <View style={s.col}>
                {label("r.issues", C.amber[0])}
                {bullets(ins.issues, C.amber[0])}
              </View>
            </View>
            {label("r.arguments", C.amber[0])}
            <View style={s.cols} wrap={false}>
              {ins.arguments.slice(0, 3).map((a, i, arr) => (
                <View key={i} style={[s.col, s.box, { marginRight: i < arr.length - 1 ? 8 : 0 }]}>
                  {tx(a.side, s.bold, { marginBottom: 4 })}
                  {bullets(a.points, C.amber[0])}
                </View>
              ))}
            </View>
            {label("r.laws", C.amber[0])}
            <View style={s.table}>
              <View style={[s.tr, { backgroundColor: C.amber[1] }]} wrap={false}>
                <Text style={[s.th, { width: "34%" }]}>{up("r.act")}</Text>
                <Text style={[s.th, { width: "18%" }]}>{up("r.section")}</Text>
                <Text style={[s.th, { width: "48%" }]}>{up("r.why")}</Text>
              </View>
              {ins.laws.map((l, i) => (
                <View key={i} style={[s.tr, i === ins.laws.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
                  {tx(l.law, { fontSize: 9 }, { padding: 6, width: "34%" }, 9)}
                  {tx(l.section, [s.bold, { fontSize: 9 }] as unknown as Style, { padding: 6, width: "18%" }, 9)}
                  {tx(l.relevance, { fontSize: 9 }, { padding: 6, width: "48%" }, 9)}
                </View>
              ))}
            </View>
          </View>
        )}

        {ver && (
          <View>
            {sectionHead(3, "sec.comparison", "agent.verifier", C.green)}
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
                <Text style={s.bold}>{t("r.confidence", { level: t(`r.${ver.confidence}`) })}</Text>
                {tx(ver.confidenceNote, { color: C.muted, fontSize: 8.5 }, {}, 8.5)}
              </View>
            </View>
            <View style={s.cols} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                {label("r.agree", C.green[0])}
                {bullets(ver.agreements, C.green[0])}
              </View>
              <View style={s.col}>
                {label("r.differ", C.green[0])}
                {bullets(ver.differences, C.green[0])}
              </View>
            </View>
            {label("r.inconsistent", C.red[0])}
            {ver.inconsistencies.length ? (
              bullets(ver.inconsistencies, C.red[0])
            ) : (
              tx(t("r.noIncons"), { color: C.muted })
            )}
          </View>
        )}

        {fin && (
          <View>
            {sectionHead(4, "sec.final", "agent.chief", C.red)}
            <View style={[s.callout, { borderLeftColor: C.red[0] }]}>
              {tx(fin.overview, { fontSize: 10.5 }, {}, 10.5)}
            </View>
            {label("r.findings", C.red[0])}
            {bullets(fin.keyFindings, C.red[0])}
            <View style={[s.cols, { marginTop: 8 }]}>
              {fin.sides.slice(0, 3).map((side, i, arr) => (
                <View key={i} style={[s.col, s.box, { marginRight: i < arr.length - 1 ? 8 : 0 }]} wrap={false}>
                  {tx(side.side, s.bold, { marginBottom: 3 })}
                  {label("r.strengths", C.green[0], 2)}
                  {bullets(side.strengths, C.green[0])}
                  {label("r.weaknesses", C.red[0])}
                  {bullets(side.weaknesses, C.red[0])}
                </View>
              ))}
            </View>
            <View style={s.cols} wrap={false}>
              <View style={[s.col, { marginRight: 12 }]}>
                {label("r.questions", C.red[0])}
                {bullets(fin.openQuestions, C.red[0])}
              </View>
              <View style={s.col}>
                {label("r.next", C.red[0])}
                {bullets(fin.nextSteps, C.red[0], true)}
              </View>
            </View>
          </View>
        )}

        <View style={s.disclaimer} wrap={false}>
          <Text style={s.discTitle}>{t("pdf.discTitle")}</Text>
          {tx(t("pdf.discText"), s.discText, {}, 8.5)}
        </View>
      </Page>
    </Document>
  );
}
