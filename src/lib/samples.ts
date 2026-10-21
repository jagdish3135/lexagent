import type { AgentOutputs } from "./schemas";
import { EXTRA_SAMPLES } from "./samples-extra";

// Fictional sample cases. Names, numbers and parties are invented for demonstration.
export interface SampleCase {
  id: string;
  /** File name (without extension) in sample-cases/. */
  slug: string;
  label: string;
  hint: string;
  text: string;
  demo: Required<AgentOutputs>;
}

const chequeText = `IN THE COURT OF THE JUDICIAL MAGISTRATE FIRST CLASS, PUNE
Criminal Complaint Case No. 1452 of 2025
(Fictional sample case for demonstration)

M/s Shree Ganesh Traders, through its proprietor Shri Anil Deshmukh ... Complainant
versus
Shri Rakesh Patil, resident of Kothrud, Pune ... Accused

COMPLAINT UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

1. The Complainant is a wholesale dealer of building hardware. Between August and November 2024 the Complainant supplied goods worth Rs. 4,80,000 to the Accused on credit, under invoices No. SGT/112 to SGT/131. The deliveries were received by the Accused's site staff, who signed the delivery challans.

2. Towards part payment of this outstanding amount, the Accused issued cheque No. 004512 dated 10.01.2025 for Rs. 4,50,000, drawn on Sahyadri Co-operative Bank, Kothrud Branch, in favour of the Complainant.

3. The Complainant presented the cheque through its account at Bank of Maharashtra, Shivajinagar Branch, Pune on 15.01.2025. The cheque was returned unpaid on 17.01.2025 with the remark "Funds Insufficient". The Complainant received the return memo on 20.01.2025.

4. On 05.02.2025 the Complainant sent a legal notice by registered post to the Accused at the address printed on the cheque, demanding payment within 15 days. Postal tracking shows the notice was delivered on 08.02.2025. The Accused neither paid the amount nor replied within 15 days, that is by 23.02.2025.

5. This complaint is filed on 10.03.2025, within one month of the cause of action. This Court has jurisdiction because the Complainant's bank branch is in Pune.

DEFENCE OF THE ACCUSED (from the reply and plea recorded on 14.05.2025)
6. The Accused admits his signature on the cheque but states that it was a blank signed cheque given as "security" in 2023, when the business relationship began, and not towards any debt.
7. The Accused states that part of the goods supplied in October 2024 were defective and were returned, so the amount claimed is inflated. He has not produced any return challan or written complaint about defects.
8. The Accused states that he did not receive the legal notice, although he admits that the address on the cheque is his residential address.

EVIDENCE ON RECORD
- Invoices SGT/112 to SGT/131 and the ledger account of the Accused
- Delivery challans signed by the Accused's site staff
- Original cheque and bank return memo dated 17.01.2025
- Copy of legal notice, postal receipt and tracking report

RELIEF SOUGHT
The Complainant prays that the Accused be summoned, tried and punished under Section 138 of the Negotiable Instruments Act, 1881, and directed to pay compensation under Section 357 CrPC / Section 395 BNSS, along with interim compensation under Section 143A.`;

const consumerText = `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, NASHIK
Consumer Complaint No. 87 of 2025
(Fictional sample case for demonstration)

Smt. Priya Kulkarni, resident of Gangapur Road, Nashik ... Complainant
versus
1. Zenith Electronics, College Road, Nashik (Retailer) ... Opposite Party No. 1
2. Novaphone India Pvt. Ltd., Gurugram (Manufacturer) ... Opposite Party No. 2

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

1. On 02.03.2025 the Complainant bought a Novaphone X12 smartphone from Opposite Party No. 1 for Rs. 62,999 (Invoice No. ZE/2025/0412). The phone came with a one-year manufacturer's warranty.

2. From May 2025 the phone began overheating and the display stopped working. The Complainant took the phone to the authorised service centre of Opposite Party No. 2 on 12.05.2025, 30.05.2025 and 21.06.2025. Each time the phone was kept for 7 to 10 days and returned with the same defect.

3. On the third visit the service centre refused warranty repair, stating "liquid damage - warranty void". No inspection report or photograph was given to the Complainant. The Complainant states that the phone was never exposed to water, and has produced photographs showing the liquid damage indicator (LDI) inside the SIM tray is white, that is, not triggered.

4. The Complainant emailed Opposite Party No. 2 on 25.06.2025 and 02.07.2025 but received no reply. A legal notice dated 10.07.2025 was also not answered.

5. The Complainant says the phone has a manufacturing defect, and that refusing warranty service without any test report is a deficiency in service and an unfair trade practice.

RELIEF SOUGHT
(a) Refund of Rs. 62,999 with interest at 9% per annum; (b) Rs. 50,000 as compensation for mental agony and harassment; (c) Rs. 10,000 as litigation costs.

REPLY OF OPPOSITE PARTY No. 1 (Retailer)
6. Opposite Party No. 1 states that it is only a seller, sold a sealed product, and that any warranty claim lies against the manufacturer.

REPLY OF OPPOSITE PARTY No. 2 (Manufacturer)
7. Opposite Party No. 2 states that its engineers found corrosion on the motherboard, which shows liquid damage, and that the warranty terms exclude liquid damage. It has filed a one-page job sheet but no photographs or lab report of the corrosion.

The complaint is filed on 05.08.2025, within two years of the cause of action. The value of the claim is within the pecuniary jurisdiction of this Commission.`;

const BASE_SAMPLES: SampleCase[] = [
  {
    id: "cheque",
    slug: "01-cheque-bounce-ni-act",
    label: "Cheque bounce",
    hint: "NI Act s.138 · Pune",
    text: chequeText,
    demo: {
      summarizer: {
        title: "Shree Ganesh Traders v. Rakesh Patil",
        caseType: "Criminal complaint - cheque dishonour",
        court: "Judicial Magistrate First Class, Pune",
        documentLanguage: "English",
        plainSummary: [
          "A hardware dealer, Shree Ganesh Traders, says it sold building material worth Rs. 4.8 lakh to Rakesh Patil on credit in late 2024.",
          "To pay most of this, Mr. Patil gave a cheque for Rs. 4.5 lakh. When the dealer deposited it in January 2025, the bank returned it because there was not enough money in the account.",
          "The dealer sent a legal notice asking for payment within 15 days. Mr. Patil did not pay or reply, so the dealer filed this criminal complaint for a bounced cheque.",
          "Mr. Patil accepts that he signed the cheque, but says it was a blank 'security' cheque from 2023, that some goods were defective and returned, and that he never got the notice.",
        ],
        parties: [
          { name: "M/s Shree Ganesh Traders (Anil Deshmukh)", role: "Complainant - supplier of goods" },
          { name: "Rakesh Patil", role: "Accused - drawer of the cheque" },
        ],
        timeline: [
          { date: "Aug-Nov 2024", event: "Goods worth Rs. 4,80,000 supplied on credit" },
          { date: "10.01.2025", event: "Cheque No. 004512 for Rs. 4,50,000 dated" },
          { date: "17.01.2025", event: "Cheque returned: Funds Insufficient" },
          { date: "05.02.2025", event: "Legal notice sent by registered post" },
          { date: "08.02.2025", event: "Notice delivered (postal tracking)" },
          { date: "23.02.2025", event: "15-day payment period ends, no payment" },
          { date: "10.03.2025", event: "Complaint filed" },
        ],
      },
      analyst: {
        keyFacts: [
          "The accused admits his signature on cheque No. 004512 for Rs. 4,50,000.",
          "The cheque was dishonoured on 17.01.2025 for 'Funds Insufficient'.",
          "A demand notice was sent within 30 days of the return memo and delivered on 08.02.2025.",
          "No payment was made within 15 days of the notice.",
          "The complaint was filed on 10.03.2025, within one month of the cause of action.",
          "Invoices, ledger and signed delivery challans support a debt of Rs. 4,80,000.",
          "The accused has produced no return challan or written complaint about defective goods.",
        ],
        issues: [
          "Was the cheque issued for a legally enforceable debt, or only as security?",
          "Has the accused rebutted the presumption under Section 139 on a preponderance of probabilities?",
          "Was the demand notice validly served at the address on the cheque?",
        ],
        arguments: [
          {
            side: "Complainant (Shree Ganesh Traders)",
            points: [
              "The signature is admitted, so the presumption under Sections 118 and 139 arises.",
              "Documents show goods worth Rs. 4.8 lakh were delivered and remain unpaid.",
              "The notice was sent to the address on the cheque and tracking shows delivery.",
            ],
          },
          {
            side: "Accused (Rakesh Patil)",
            points: [
              "The cheque was a blank security cheque from 2023, not issued for this debt.",
              "Part of the goods were defective and returned, so the claimed amount is inflated.",
              "He did not receive the legal notice.",
            ],
          },
        ],
        laws: [
          { law: "Negotiable Instruments Act, 1881", section: "Section 138", relevance: "Offence of dishonour of a cheque for insufficient funds." },
          { law: "Negotiable Instruments Act, 1881", section: "Section 139", relevance: "Presumption that the cheque was given for a debt; the accused can rebut it." },
          { law: "Negotiable Instruments Act, 1881", section: "Section 118", relevance: "Presumption of consideration for a negotiable instrument." },
          { law: "Negotiable Instruments Act, 1881", section: "Section 142", relevance: "Cognizance on a written complaint within one month; jurisdiction where the payee's bank branch is." },
          { law: "Negotiable Instruments Act, 1881", section: "Section 143A", relevance: "Court may order interim compensation of up to 20% of the cheque amount." },
          { law: "General Clauses Act, 1897", section: "Section 27", relevance: "Presumption of service for a notice sent by registered post to the correct address." },
        ],
      },
      verifier: {
        agreements: [
          "Both agree the signature is admitted and the cheque bounced for insufficient funds.",
          "Both place the notice, the 15-day period and the filing date within the legal time limits.",
          "Both identify the 'security cheque' defence as the main dispute.",
        ],
        differences: [
          "The Summarizer focuses on the story; the Legal Analyst adds the statutory presumptions that shift the burden to the accused.",
          "Only the Legal Analyst flags the presumption of service under the General Clauses Act for the notice defence.",
        ],
        inconsistencies: [
          "The cheque (Rs. 4,50,000) is less than the claimed debt (Rs. 4,80,000). Both outputs mention it, but the effect of the alleged returned goods on the balance is not yet proved by either side.",
        ],
        confidence: "High",
        confidenceNote: "Dates, amounts and documents are stated clearly in the complaint and both agents read them the same way.",
      },
      chief: {
        overview:
          "This is a complaint for a dishonoured cheque under Section 138 of the NI Act. The procedural steps (presentation, notice, 15-day period and filing) appear to be within time. The signature is admitted, so the law presumes the cheque was given for a debt. The case will mainly turn on whether the accused can make his 'security cheque' and 'defective goods' defence probable with evidence.",
        keyFindings: [
          "All statutory timelines under Sections 138 and 142 appear to be met.",
          "The admitted signature triggers the presumptions under Sections 118 and 139.",
          "The complainant's documents (invoices, ledger, signed challans) support the debt.",
          "The accused has not yet produced evidence of returned goods or of the cheque being only security.",
          "A notice sent by registered post to the admitted address is presumed served unless disproved.",
        ],
        sides: [
          {
            side: "Complainant",
            strengths: ["Admitted signature", "Complete paper trail for the supply", "Timelines met"],
            weaknesses: ["Cheque amount differs from the ledger balance, which needs explaining"],
          },
          {
            side: "Accused",
            strengths: ["Can rebut the presumption on a preponderance of probabilities, without proving it beyond doubt"],
            weaknesses: ["No return challans or written defect complaints", "Admits the notice address is his own"],
          },
        ],
        openQuestions: [
          "Is there any written record of goods being returned in October 2024?",
          "When was the cheque actually handed over, and was the date filled in by the complainant?",
          "Do the ledger entries match the invoices and the cheque amount?",
        ],
        nextSteps: [
          "Collect certified copies of the bank return memo and postal tracking report.",
          "Prepare the ledger reconciliation explaining the Rs. 30,000 difference.",
          "Note that an appeal against conviction may require a deposit of at least 20% under Section 148.",
          "Explore settlement: Section 147 makes this offence compoundable at any stage.",
          "Consult an advocate before the evidence stage.",
        ],
      },
    },
  },
  {
    id: "consumer",
    slug: "02-defective-phone-consumer",
    label: "Defective phone",
    hint: "Consumer Protection Act · Nashik",
    text: consumerText,
    demo: {
      summarizer: {
        title: "Priya Kulkarni v. Zenith Electronics & Novaphone India",
        caseType: "Consumer complaint - defective product and deficiency in service",
        court: "District Consumer Disputes Redressal Commission, Nashik",
        documentLanguage: "English",
        plainSummary: [
          "Priya Kulkarni bought a Rs. 62,999 smartphone in March 2025. Within about two months it started overheating and the screen stopped working.",
          "She took it to the company's authorised service centre three times, but the problem was never fixed. On the third visit the centre refused free repair, saying the phone had water damage.",
          "She says the phone never touched water and has photos showing the water-damage sticker was not triggered. The company did not reply to her emails or her legal notice.",
          "She asks for a full refund, Rs. 50,000 for mental agony and Rs. 10,000 for legal costs. The shop says only the manufacturer is responsible; the manufacturer says water damage cancels the warranty.",
        ],
        parties: [
          { name: "Priya Kulkarni", role: "Complainant - consumer" },
          { name: "Zenith Electronics", role: "Opposite Party 1 - retailer" },
          { name: "Novaphone India Pvt. Ltd.", role: "Opposite Party 2 - manufacturer" },
        ],
        timeline: [
          { date: "02.03.2025", event: "Phone bought for Rs. 62,999" },
          { date: "12.05.2025", event: "First service centre visit" },
          { date: "30.05.2025", event: "Second visit, same defect" },
          { date: "21.06.2025", event: "Third visit, warranty refused as 'liquid damage'" },
          { date: "10.07.2025", event: "Legal notice sent, no reply" },
          { date: "05.08.2025", event: "Complaint filed" },
        ],
      },
      analyst: {
        keyFacts: [
          "The phone was bought on 02.03.2025 with a one-year manufacturer's warranty.",
          "The same defect remained after three service centre visits.",
          "Warranty was refused as 'liquid damage' without any inspection report.",
          "The complainant has photographs showing the liquid damage indicator is not triggered.",
          "The manufacturer filed only a one-page job sheet, with no photographs or lab report.",
          "Emails and the legal notice went unanswered.",
        ],
        issues: [
          "Does the phone have a manufacturing 'defect' under Section 2(10)?",
          "Was refusing warranty repair without a test report a 'deficiency' in service under Section 2(11)?",
          "Is the retailer liable along with the manufacturer?",
          "What relief and compensation are appropriate?",
        ],
        arguments: [
          {
            side: "Complainant (Priya Kulkarni)",
            points: [
              "A recurring defect within the warranty period shows a manufacturing defect.",
              "The 'liquid damage' claim is unsupported; the indicator photos contradict it.",
              "Ignoring emails and the notice adds to the deficiency in service.",
            ],
          },
          {
            side: "Retailer (Zenith Electronics)",
            points: ["It only sold a sealed product; warranty obligations lie with the manufacturer."],
          },
          {
            side: "Manufacturer (Novaphone India)",
            points: ["Engineers found motherboard corrosion showing liquid damage.", "The warranty terms exclude liquid damage."],
          },
        ],
        laws: [
          { law: "Consumer Protection Act, 2019", section: "Section 2(10)", relevance: "Defines 'defect' in goods." },
          { law: "Consumer Protection Act, 2019", section: "Section 2(11)", relevance: "Defines 'deficiency' in service, including warranty service." },
          { law: "Consumer Protection Act, 2019", section: "Section 2(47)", relevance: "Unfair trade practice, which the complainant alleges." },
          { law: "Consumer Protection Act, 2019", section: "Section 35", relevance: "How a complaint is filed before the District Commission." },
          { law: "Consumer Protection Act, 2019", section: "Section 39", relevance: "Reliefs: replacement, refund, compensation and costs." },
          { law: "Consumer Protection Act, 2019", section: "Section 69", relevance: "Two-year limitation period, which is met here." },
          { law: "Consumer Protection Act, 2019", section: "Section 84", relevance: "Product liability of the manufacturer for a manufacturing defect." },
        ],
      },
      verifier: {
        agreements: [
          "Both agree the defect recurred within the warranty period after three repair attempts.",
          "Both identify the unproven 'liquid damage' claim as the central dispute.",
          "Both note the complaint is within the two-year limitation period.",
        ],
        differences: [
          "The Legal Analyst separates the retailer's position from the manufacturer's; the Summarizer treats them together.",
          "The Legal Analyst raises product liability under Section 84, which the Summarizer does not mention.",
        ],
        inconsistencies: [],
        confidence: "Medium",
        confidenceNote:
          "The facts are clear, but the outcome depends on technical evidence (corrosion versus indicator photos) that is not yet on record.",
      },
      chief: {
        overview:
          "This is a consumer complaint about a smartphone that developed a recurring defect within warranty. The key question is whether the manufacturer's 'liquid damage' defence is proved. At present it rests on a one-page job sheet, while the complainant has photographs of an untriggered damage indicator. The Commission may weigh the lack of a test report against the manufacturer and may also consider a court-appointed expert inspection.",
        keyFindings: [
          "The defect appeared within about two months and survived three repair attempts.",
          "The manufacturer has not produced photographs or a lab report to prove liquid damage.",
          "Unanswered emails and legal notice support the claim of deficiency in service.",
          "The retailer's liability is limited if the defect is in manufacturing, but it may still be named as a party.",
          "The complaint is within time and within the Commission's pecuniary jurisdiction.",
        ],
        sides: [
          {
            side: "Complainant",
            strengths: ["Repeated defect within warranty", "Indicator photographs", "Paper trail of visits and notices"],
            weaknesses: ["No independent expert report of her own yet"],
          },
          {
            side: "Manufacturer",
            strengths: ["Warranty terms exclude liquid damage"],
            weaknesses: ["No photographs or lab report", "Did not respond to the consumer before litigation"],
          },
        ],
        openQuestions: [
          "Will the Commission order an independent expert examination of the phone?",
          "Do the job sheets from the first two visits mention liquid damage or not?",
          "Are the indicator photographs dated and verifiable?",
        ],
        nextSteps: [
          "Keep the phone in its present condition; it may be sent for expert inspection.",
          "Collect all three job sheets and the email trail.",
          "Ask the manufacturer, through the Commission, to produce its inspection photographs.",
          "Mediation under Chapter V of the Act may give a faster settlement.",
        ],
      },
    },
  },
];

export const SAMPLES: SampleCase[] = [...BASE_SAMPLES, ...EXTRA_SAMPLES];

/** File formats shipped for a sample. Hindi/Marathi ones skip PDF: PDF text layers break Devanagari. */
export const sampleFormats = (s: SampleCase): readonly ("pdf" | "docx" | "txt")[] =>
  /[ऀ-ॿ]/.test(s.text) ? ["docx", "txt"] : ["pdf", "docx", "txt"];

/** Samples shown as one-click buttons on the dashboard (the rest are downloadable files). */
export const SAMPLE_BUTTONS = ["cheque", "consumer", "farmroad", "maintenance"];
