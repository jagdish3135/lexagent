// Builds the sample-cases/ folder: fictional Indian case documents as PDF, DOCX and TXT, for trying LexAgent's upload.
// Usage: npm run samples
import { mkdirSync, writeFileSync } from "node:fs";
import { crc32 } from "node:zlib";
import { Document, Page, Text, View, renderToFile } from "@react-pdf/renderer";
import { pdfSafe } from "../src/lib/pdf/clean";
import { SAMPLES } from "../src/lib/samples";
import { SAMPLE_FILES } from "../src/lib/sample-files";

const jobFraud = `IN THE COURT OF THE JUDICIAL MAGISTRATE FIRST CLASS, NAGPUR
Bail Application No. 312 of 2025 in FIR No. 214 of 2025, Police Station Sitabuldi
(Fictional sample case for demonstration)

Vikram Joshi, resident of Dharampeth, Nagpur ... Applicant (Accused)
versus
State of Maharashtra ... Respondent
Smt. Meena Rao ... Complainant (Intervenor)

APPLICATION FOR REGULAR BAIL UNDER SECTION 480 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023

1. The Applicant was arrested on 18.03.2025 in FIR No. 214 of 2025 registered under Sections 318(4), 336(3) and 340(2) of the Bharatiya Nyaya Sanhita, 2023 (cheating, forgery for the purpose of cheating, and using a forged document as genuine).

2. The prosecution case is that on 12.02.2025 the Applicant took Rs. 3,20,000 from the Complainant by bank transfer, promising her son a clerk's post in the Central Railway, and later handed over an appointment letter which the Railway has confirmed is forged. The Complainant has produced the bank statement, WhatsApp chats with the Applicant and the letter.

3. The Applicant states that the amount was a hand loan for his travel business, that he never issued any appointment letter, and that the WhatsApp chats are edited. He offers to deposit Rs. 3,20,000 in Court without admitting liability.

4. The investigating officer has seized the Applicant's mobile phone. The forensic report on the phone and the handwriting expert's opinion on the letter are pending. Two other persons have given statements that they paid the Applicant for similar job promises in 2024.

5. The Applicant has no previous criminal record, is the sole earning member of his family, and has been in custody for 26 days. The prosecution opposes bail on the grounds that the Applicant may tamper with evidence and influence the two other witnesses.

PRAYER
The Applicant prays to be released on bail on such terms and conditions as this Court deems fit.`;

const eviction = `IN THE COURT OF SMALL CAUSES AT MUMBAI
R.A.E. Suit No. 1187 of 2025
(Fictional sample case for demonstration)

Shri Prakash Mehta, resident of Dadar (West), Mumbai ... Plaintiff (Landlord)
versus
Shri Ganesh Pawar, occupying Room No. 7, Sai Kripa Chawl, Dadar (West) ... Defendant (Tenant)

SUIT FOR EVICTION UNDER SECTIONS 15 AND 16(1)(g) OF THE MAHARASHTRA RENT CONTROL ACT, 1999

1. The Defendant has been a monthly tenant of Room No. 7 since 1998 at a present rent of Rs. 2,500 per month. The tenancy is governed by the Maharashtra Rent Control Act, 1999.

2. ARREARS: The Defendant has not paid rent from April 2024 to May 2025, i.e. 14 months, amounting to Rs. 35,000. A notice demanding the arrears was served on 10.06.2025. The Defendant did not pay within ninety days of the notice.

3. BONA FIDE REQUIREMENT: The Plaintiff's son is getting married in December 2025 and needs a separate residence. The Plaintiff's own flat in the same building has only one room. The Plaintiff says he has no other suitable accommodation in Mumbai.

DEFENDANT'S WRITTEN STATEMENT
4. The Defendant states that he sent the rent every month by money order from April 2024, but the Plaintiff refused to accept it in order to create a ground for eviction. He has produced 9 money-order receipts marked "refused".

5. The Defendant states that the Plaintiff owns another flat in Thane which has been lying vacant since 2023, so the claimed need is not genuine. He also says that he and his family of five have no other place to live, and that eviction would cause greater hardship to him than refusal would cause to the Plaintiff.

6. The Defendant has deposited Rs. 35,000 in Court on 05.09.2025, after receiving the summons.

RELIEF SOUGHT
The Plaintiff prays for a decree of eviction, arrears of rent of Rs. 35,000, and mesne profits from the date of the suit until possession is handed over.`;

const accident = `BEFORE THE MOTOR ACCIDENT CLAIMS TRIBUNAL, KOLHAPUR
M.A.C.P. No. 642 of 2025
(Fictional sample case for demonstration)

Shri Rohan Kulkarni, aged 29 years, resident of Rajarampuri, Kolhapur ... Claimant
versus
1. Shri Sunil Yadav, owner of truck No. MH-09-AB-4521 ... Opponent No. 1
2. Shri Ramesh Gaikwad, driver of the said truck ... Opponent No. 2
3. National Assurance Co. Ltd., insurer of the said truck ... Opponent No. 3

CLAIM PETITION UNDER SECTION 166 OF THE MOTOR VEHICLES ACT, 1988

1. On 22.01.2025 at about 8.30 p.m., the Claimant was riding his motorcycle on the Kolhapur-Sangli road when the truck, driven rashly and at high speed by Opponent No. 2, overtook from the wrong side and hit the motorcycle. FIR No. 37 of 2025 was registered at Shiroli Police Station against Opponent No. 2.

2. The Claimant suffered a fracture of the right femur and a head injury. He was treated at a private hospital for 23 days and spent Rs. 3,20,000 on treatment. The medical board has certified 30% permanent disability of the right leg.

3. The Claimant worked as a sales executive earning Rs. 18,000 per month. He was unable to work for 7 months and says his future earning capacity has fallen because he can no longer travel for field sales.

4. The Claimant claims Rs. 18,50,000 as compensation, with interest at 9% per annum, under the heads of medical expenses, loss of income, future loss of earning capacity, pain and suffering, and loss of amenities.

WRITTEN STATEMENT OF OPPONENT No. 3 (INSURER)
5. The insurer admits that the truck was insured on the date of the accident. It states that the driver's licence was not valid for a heavy goods vehicle on that date, which is a breach of the policy conditions, and that the insurer is therefore not liable to pay.

6. The insurer further states that the Claimant was not wearing a helmet and was himself negligent, and that the income claimed is not supported by salary slips or income-tax returns.

7. Opponents No. 1 and 2 did not appear despite service and are proceeded ex parte.`;

const TEXTS: Record<string, string> = {
  "01-cheque-bounce-ni-act": SAMPLES.find((s) => s.id === "cheque")!.text,
  "02-defective-phone-consumer": SAMPLES.find((s) => s.id === "consumer")!.text,
  "03-job-fraud-cheating-bns": jobFraud,
  "04-tenant-eviction-rent-act": eviction,
  "05-motor-accident-claim": accident,
};

// --- DOCX: a minimal WordprocessingML package in an uncompressed ZIP (no dependencies) ---
function zip(files: Record<string, string>): Buffer {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content, "utf8");
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, data);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(data.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const cenBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cenBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cenBuf, end]);
}

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function docx(text: string): Buffer {
  const paras = text
    .split("\n")
    .map((line, i) => {
      const heading = i === 0 || /^[A-Z][A-Z .,'()0-9-]{12,}$/.test(line.trim());
      const run = heading ? `<w:rPr><w:b/></w:rPr>` : "";
      return `<w:p>${heading ? '<w:pPr><w:jc w:val="center"/></w:pPr>' : ""}<w:r>${run}<w:t xml:space="preserve">${xml(line)}</w:t></w:r></w:p>`;
    })
    .join("");
  return zip({
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
  });
}

// --- PDF: a plain, court-style typed document ---
function CasePdf({ text }: { text: string }) {
  const [first, ...rest] = pdfSafe(text).split("\n");
  return (
    <Document title={first} author="LexAgent sample cases">
      <Page size="A4" style={{ padding: 64, fontFamily: "Times-Roman", fontSize: 11.5, lineHeight: 1.55 }}>
        <Text style={{ fontFamily: "Times-Bold", fontSize: 13, textAlign: "center", marginBottom: 6 }}>{first}</Text>
        <View>
          {rest.map((line, i) =>
            line.trim() === "" ? (
              <View key={i} style={{ height: 8 }} />
            ) : (
              <Text key={i} style={/^[A-Z][A-Z .,'()0-9-]{12,}$/.test(line.trim()) ? { fontFamily: "Times-Bold", textAlign: "center", marginVertical: 4 } : {}}>
                {line}
              </Text>
            ),
          )}
        </View>
        <Text fixed style={{ position: "absolute", bottom: 30, left: 64, right: 64, fontSize: 8, color: "#777", textAlign: "center" }}>
          Fictional sample case for LexAgent · not a real court record
        </Text>
      </Page>
    </Document>
  );
}

mkdirSync("sample-cases", { recursive: true });
for (const f of SAMPLE_FILES) {
  const text = TEXTS[f.slug]!;
  writeFileSync(`sample-cases/${f.slug}.txt`, text + "\n");
  writeFileSync(`sample-cases/${f.slug}.docx`, docx(text));
  await renderToFile(<CasePdf text={text} />, `sample-cases/${f.slug}.pdf`);
  console.log("wrote", f.slug);
}
