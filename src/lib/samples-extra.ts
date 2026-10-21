import type { SampleCase } from "./samples";

// More fictional sample cases, including two in the local languages district courts use (Marathi, Hindi).
// Names, numbers and parties are invented for demonstration.

const jobFraudText = `IN THE COURT OF THE JUDICIAL MAGISTRATE FIRST CLASS, NAGPUR
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

const evictionText = `IN THE COURT OF SMALL CAUSES AT MUMBAI
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

const accidentText = `BEFORE THE MOTOR ACCIDENT CLAIMS TRIBUNAL, KOLHAPUR
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

const farmRoadText = `मा. दिवाणी न्यायाधीश (कनिष्ठ स्तर) यांचे न्यायालय, वडूज, जिल्हा सातारा
नियमित दिवाणी दावा क्र. 214/2025
(प्रात्यक्षिकासाठी काल्पनिक नमुना प्रकरण)

श्री. रामचंद्र दत्तात्रय जाधव, वय 58, धंदा शेती, रा. वडूज, ता. खटाव, जि. सातारा ... वादी
विरुद्ध
श्री. सुरेश बाळासाहेब पवार, वय 46, धंदा शेती, रा. वडूज, ता. खटाव, जि. सातारा ... प्रतिवादी

कायम व तात्पुरत्या मनाई हुकुमासाठी तसेच अडथळा काढण्याच्या आदेशासाठी दावा

1. वादी यांच्या मालकीची गट नं. 112 ही शेतजमीन मौजे वडूज येथे आहे. या जमिनीत जाण्यासाठी प्रतिवादी यांच्या गट नं. 113 मधून जाणारा सुमारे 10 फूट रुंदीचा बैलगाडी रस्ता गेली 35 वर्षांहून अधिक काळ वादी व त्यांचे वडील उघडपणे, शांततेने आणि हक्काने वापरत आहेत.

2. दिनांक 14.06.2025 रोजी, खरीप पेरणीच्या आधी, प्रतिवादी यांनी या रस्त्यावर तारेचे कुंपण घातले व चर खणला. त्यामुळे वादी यांना ट्रॅक्टर, बियाणे व खते शेतात नेता येत नाहीत आणि पेरणी थांबली आहे.

3. दिनांक 18.06.2025 रोजी गाव कामगार तलाठी यांनी केलेल्या पंचनाम्यात रस्ता अडवलेला असल्याचे नमूद आहे. गावातील दोन वयोवृद्ध साक्षीदारांनी हा रस्ता अनेक वर्षांपासून वापरात असल्याचे प्रतिज्ञापत्र दिले आहे. वादी यांनी कुंपणाचे फोटो दाखल केले आहेत.

4. वादी यांच्याकडे शेतात जाण्यासाठी दुसरा कोणताही सोयीचा मार्ग नाही, असे वादी यांचे म्हणणे आहे.

प्रतिवादी यांचे लेखी म्हणणे
5. प्रतिवादी यांच्या मते असा कोणताही वहिवाटीचा रस्ता अस्तित्वात नाही. गट नं. 113 च्या 7/12 उताऱ्यावर किंवा गाव नकाशावर अशा रस्त्याची नोंद नाही.

6. वादी यांना पूर्वेकडील गावठाण रस्त्याने शेतात जाता येते, त्यामुळे गरजेचा हक्क (सुखाधिकार) लागू होत नाही. तसेच शेतरस्त्याचा प्रश्न महाराष्ट्र जमीन महसूल संहिता, 1966 च्या कलम 143 अन्वये तहसीलदारांकडे सोडवायला हवा होता, असे प्रतिवादी यांचे म्हणणे आहे.

मागणी
वादी विनंती करतात की प्रतिवादी यांना रस्त्यात अडथळा करण्यास कायमची मनाई करावी, दावा निकाली निघेपर्यंत तात्पुरता मनाई हुकूम द्यावा, आणि कुंपण व चर काढून टाकण्याचा आदेश द्यावा.`;

const maintenanceText = `कुटुंब न्यायालय, भोपाल (मध्य प्रदेश)
भरण-पोषण प्रकरण क्र. 156/2025
(प्रदर्शन के लिए काल्पनिक नमूना प्रकरण)

श्रीमती सुनीता वर्मा, आयु 31 वर्ष, एवं नाबालिग पुत्र आरव वर्मा (आयु 5 वर्ष), निवासी कोलार रोड, भोपाल ... आवेदिकागण
विरुद्ध
श्री राजेश वर्मा, आयु 35 वर्ष, निवासी अरेरा कॉलोनी, भोपाल ... अनावेदक

भारतीय नागरिक सुरक्षा संहिता, 2023 की धारा 144 के अंतर्गत भरण-पोषण हेतु आवेदन

1. आवेदिका का विवाह अनावेदक से 12.05.2018 को हिंदू रीति-रिवाज से हुआ था। विवाह से एक पुत्र आरव का जन्म हुआ, जो वर्तमान में आवेदिका के साथ रहता है।

2. आवेदिका का कहना है कि विवाह के बाद से अनावेदक और उसके परिवार ने दहेज की माँग को लेकर उसे प्रताड़ित किया। मार्च 2024 में उसे घर से निकाल दिया गया, तब से वह अपने माता-पिता के घर रह रही है। इस संबंध में आवेदिका ने 02.04.2024 को महिला थाने में शिकायत दी थी।

3. अनावेदक एक निजी कंपनी में सहायक प्रबंधक है और उसकी मासिक आय लगभग ₹45,000 है। आवेदिका की अपनी कोई आय नहीं है। आवेदिका स्वयं के लिए ₹15,000 और पुत्र के लिए ₹10,000 प्रति माह भरण-पोषण तथा प्रकरण के निराकरण तक अंतरिम भरण-पोषण चाहती है।

अनावेदक का जवाब
4. अनावेदक का कहना है कि आवेदिका बिना किसी पर्याप्त कारण के स्वयं घर छोड़कर गई और दहेज के आरोप झूठे हैं। उसकी वास्तविक मासिक आय केवल ₹22,000 है और उस पर अपने वृद्ध माता-पिता की ज़िम्मेदारी भी है।

5. अनावेदक के अनुसार आवेदिका स्नातक है और पहले एक निजी स्कूल में पढ़ाती थी, इसलिए वह स्वयं कमा सकती है। वह पुत्र के लिए ₹4,000 प्रति माह देने को तैयार है।

6. अनावेदक ने अपनी आय का कोई वेतन पर्ची या आयकर विवरण अभी तक प्रस्तुत नहीं किया है।

प्रार्थना
आवेदिकागण निवेदन करते हैं कि अनावेदक को आवेदिका और पुत्र के लिए उचित मासिक भरण-पोषण तथा अंतरिम भरण-पोषण देने का आदेश दिया जाए।`;

export const EXTRA_SAMPLES: SampleCase[] = [
  {
    id: "jobfraud",
    slug: "03-job-fraud-cheating-bns",
    label: "Job-offer fraud bail",
    hint: "BNS s.318 · Nagpur",
    text: jobFraudText,
    demo: {
      summarizer: {
        title: "Vikram Joshi v. State of Maharashtra (bail)",
        caseType: "Bail application - cheating and forgery",
        court: "Judicial Magistrate First Class, Nagpur",
        documentLanguage: "English",
        plainSummary: [
          "Vikram Joshi is in jail, accused of taking Rs. 3.2 lakh from Meena Rao by promising her son a Railway job and then giving a fake appointment letter.",
          "He has asked the court to release him on bail. He says the money was a loan for his business, that he never gave any letter, and that the chats are edited.",
          "The police are still waiting for the forensic report on his phone and a handwriting expert's opinion on the letter. Two other people say he took money from them for similar promises.",
          "The prosecution fears he may tamper with evidence or influence those two witnesses. He has no criminal record and has been in custody for 26 days.",
        ],
        parties: [
          { name: "Vikram Joshi", role: "Applicant - accused" },
          { name: "State of Maharashtra", role: "Respondent - prosecution" },
          { name: "Smt. Meena Rao", role: "Complainant" },
        ],
        timeline: [
          { date: "2024", event: "Two other persons allegedly pay the applicant for job promises" },
          { date: "12.02.2025", event: "Rs. 3,20,000 transferred by the complainant" },
          { date: "18.03.2025", event: "Applicant arrested in FIR No. 214 of 2025" },
          { date: "Pending", event: "Forensic report on phone and handwriting opinion" },
        ],
      },
      analyst: {
        keyFacts: [
          "The FIR is under BNS Sections 318(4), 336(3) and 340(2).",
          "The payment of Rs. 3,20,000 by bank transfer is not disputed; its purpose is.",
          "The Railway has confirmed that the appointment letter is forged.",
          "The applicant's phone has been seized; key expert reports are pending.",
          "Two other persons have given statements about similar payments.",
          "The applicant has no previous record and has been in custody for 26 days.",
        ],
        issues: [
          "Should the applicant be released on bail while the investigation is pending?",
          "Is there a real risk of tampering with evidence or influencing witnesses?",
          "What conditions, if any, would address the prosecution's concerns?",
        ],
        arguments: [
          {
            side: "Applicant (Vikram Joshi)",
            points: [
              "No criminal record and 26 days already in custody.",
              "The main evidence (bank records, phone, letter) is documentary and already seized.",
              "Offers to deposit the amount in court without admitting guilt.",
            ],
          },
          {
            side: "Prosecution (State of Maharashtra)",
            points: [
              "Forensic and handwriting reports are still pending.",
              "Similar statements from two other persons suggest a pattern.",
              "Risk that the applicant may contact or influence witnesses.",
            ],
          },
        ],
        laws: [
          { law: "Bharatiya Nyaya Sanhita, 2023", section: "Section 318(4)", relevance: "Cheating and dishonestly inducing delivery of property (replaces IPC s.420)." },
          { law: "Bharatiya Nyaya Sanhita, 2023", section: "Section 336(3)", relevance: "Forgery for the purpose of cheating (replaces IPC s.468)." },
          { law: "Bharatiya Nyaya Sanhita, 2023", section: "Section 340(2)", relevance: "Using a forged document as genuine (replaces IPC s.471)." },
          { law: "Bharatiya Nagarik Suraksha Sanhita, 2023", section: "Section 480", relevance: "Bail in non-bailable offences by a court other than the High Court or Sessions Court (replaces CrPC s.437)." },
        ],
      },
      verifier: {
        agreements: [
          "Both identify the payment, the forged letter and the pending expert reports as the core facts.",
          "Both note the applicant's clean record and 26 days in custody.",
        ],
        differences: [
          "The Legal Analyst adds the old IPC equivalents of the new BNS sections; the Summarizer does not.",
          "The Summarizer stresses the loan defence; the Legal Analyst focuses on tampering risk and bail conditions.",
        ],
        inconsistencies: ["The application does not state its own filing date; the 26 days of custody is the only time reference after arrest."],
        confidence: "Medium",
        confidenceNote: "The facts are clear, but the outcome turns on reports that are not yet on record.",
      },
      chief: {
        overview:
          "This is a regular bail application under BNSS Section 480 in a cheating and forgery case. The documentary evidence is largely seized, the applicant has no record and has been in custody for 26 days, while the prosecution points to pending expert reports and two similar complaints. The court will weigh the risk of tampering against continued detention, and may consider conditions instead of refusal.",
        keyFindings: [
          "The money transfer is admitted; only its purpose is disputed.",
          "The forged letter is confirmed by the Railway; who made it is not yet established.",
          "Pending forensic and handwriting reports are the prosecution's main reason to oppose bail.",
          "Two similar statements may affect how the court views the risk to witnesses.",
        ],
        sides: [
          {
            side: "Applicant",
            strengths: ["Clean record", "Evidence already seized", "Offer to deposit the amount"],
            weaknesses: ["Admitted receipt of the money", "Similar statements from two other persons"],
          },
          {
            side: "Prosecution",
            strengths: ["Forged letter confirmed", "Pattern suggested by other statements"],
            weaknesses: ["Key expert reports still pending", "No specific instance of tampering alleged"],
          },
        ],
        openQuestions: [
          "What do the forensic report on the phone and the handwriting opinion show?",
          "Are the two other persons' payments supported by documents?",
          "Can conditions such as reporting to the police station protect the witnesses?",
        ],
        nextSteps: [
          "Ask for the status of the forensic and handwriting reports.",
          "Prepare proposed bail conditions (reporting, no contact with witnesses, surety).",
          "Keep proof of the bank transfer and the chats ready for the hearing.",
          "Consult an advocate experienced in bail matters under the BNSS.",
        ],
      },
    },
  },
  {
    id: "eviction",
    slug: "04-tenant-eviction-rent-act",
    label: "Tenant eviction",
    hint: "Rent Control Act · Mumbai",
    text: evictionText,
    demo: {
      summarizer: {
        title: "Prakash Mehta v. Ganesh Pawar",
        caseType: "Civil suit - eviction of a tenant",
        court: "Court of Small Causes, Mumbai",
        documentLanguage: "English",
        plainSummary: [
          "A landlord, Prakash Mehta, wants to evict his tenant of 27 years, Ganesh Pawar, from a chawl room in Dadar.",
          "He gives two reasons: 14 months of unpaid rent (Rs. 35,000), and that his son is marrying and needs the room.",
          "The tenant says he sent rent by money order every month but the landlord refused it on purpose. He also says the landlord has an empty flat in Thane, so the need is not real.",
          "After receiving the summons, the tenant deposited the full Rs. 35,000 in court.",
        ],
        parties: [
          { name: "Prakash Mehta", role: "Plaintiff - landlord" },
          { name: "Ganesh Pawar", role: "Defendant - tenant since 1998" },
        ],
        timeline: [
          { date: "1998", event: "Tenancy begins" },
          { date: "Apr 2024 - May 2025", event: "14 months' rent alleged unpaid" },
          { date: "10.06.2025", event: "Demand notice served" },
          { date: "05.09.2025", event: "Tenant deposits Rs. 35,000 in court" },
          { date: "Dec 2025", event: "Plaintiff's son's marriage" },
        ],
      },
      analyst: {
        keyFacts: [
          "The tenancy is governed by the Maharashtra Rent Control Act, 1999.",
          "Arrears of Rs. 35,000 are claimed for 14 months.",
          "The tenant has 9 money-order receipts marked 'refused'.",
          "The full arrears were deposited in court on 05.09.2025.",
          "The landlord allegedly owns a vacant flat in Thane.",
        ],
        issues: [
          "Was the tenant in default, given the refused money orders and the deposit in court?",
          "Is the landlord's need for the room reasonable and bona fide?",
          "Would a decree cause greater hardship to the tenant than refusing it would cause to the landlord?",
        ],
        arguments: [
          {
            side: "Landlord (Prakash Mehta)",
            points: ["Rent unpaid for 14 months and not paid within 90 days of notice.", "His son needs a separate home after marriage."],
          },
          {
            side: "Tenant (Ganesh Pawar)",
            points: [
              "Rent was tendered by money order and refused.",
              "The vacant Thane flat shows the need is not genuine.",
              "Eviction would leave a family of five without a home.",
            ],
          },
        ],
        laws: [
          { law: "Maharashtra Rent Control Act, 1999", section: "Section 15", relevance: "Eviction for arrears of rent, with the tenant's chance to pay after notice." },
          { law: "Maharashtra Rent Control Act, 1999", section: "Section 16(1)(g)", relevance: "Eviction where the landlord reasonably and bona fide needs the premises." },
          { law: "Maharashtra Rent Control Act, 1999", section: "Section 16(2)", relevance: "The court must weigh comparative hardship before a bona fide-need decree." },
        ],
      },
      verifier: {
        agreements: ["Both note the money-order defence and the deposit in court.", "Both identify the Thane flat as central to the bona fide need claim."],
        differences: ["Only the Legal Analyst raises the comparative-hardship test under Section 16(2)."],
        inconsistencies: [],
        confidence: "High",
        confidenceNote: "The pleadings are clear and both readings match the document.",
      },
      chief: {
        overview:
          "The landlord relies on two grounds: arrears and bona fide need. The arrears ground is weakened by the refused money orders and the full deposit in court. The bona fide need ground will depend on the evidence about the Thane flat and on the comparative-hardship test, which the court must apply before evicting a long-standing tenant.",
        keyFindings: [
          "Refused money orders, if proved, suggest the tenant was ready and willing to pay.",
          "The deposit of the full arrears in court is relevant to the arrears ground.",
          "Ownership and suitability of the Thane flat is the key fact for bona fide need.",
          "Comparative hardship must be considered for a family of five living there since 1998.",
        ],
        sides: [
          { side: "Landlord", strengths: ["Specific, dated need (son's marriage)"], weaknesses: ["Vacant Thane flat", "Refused money orders"] },
          { side: "Tenant", strengths: ["Money-order receipts", "Full deposit in court", "27-year tenancy"], weaknesses: ["Deposit made only after the summons"] },
        ],
        openQuestions: ["Is the Thane flat suitable and available for the son?", "Do postal records confirm the refusals?"],
        nextSteps: ["Collect postal records of the refused money orders.", "Gather evidence about the Thane flat (ownership, occupancy).", "Consult an advocate on the hardship evidence to file."],
      },
    },
  },
  {
    id: "accident",
    slug: "05-motor-accident-claim",
    label: "Road accident claim",
    hint: "Motor Vehicles Act · Kolhapur",
    text: accidentText,
    demo: {
      summarizer: {
        title: "Rohan Kulkarni v. Sunil Yadav and others",
        caseType: "Motor accident compensation claim",
        court: "Motor Accident Claims Tribunal, Kolhapur",
        documentLanguage: "English",
        plainSummary: [
          "Rohan Kulkarni, a 29-year-old sales executive, was hit by a truck on the Kolhapur-Sangli road while riding his motorcycle.",
          "He broke his thigh bone, was in hospital for 23 days, spent Rs. 3.2 lakh, and now has a 30% permanent disability in his right leg.",
          "He claims Rs. 18.5 lakh from the truck owner, the driver and the insurance company.",
          "The insurer says the driver did not have a valid heavy-vehicle licence, that Rohan wasn't wearing a helmet, and that his income isn't proved. The owner and driver did not appear.",
        ],
        parties: [
          { name: "Rohan Kulkarni", role: "Claimant - injured rider" },
          { name: "Sunil Yadav", role: "Opponent 1 - truck owner (ex parte)" },
          { name: "Ramesh Gaikwad", role: "Opponent 2 - driver (ex parte)" },
          { name: "National Assurance Co. Ltd.", role: "Opponent 3 - insurer" },
        ],
        timeline: [
          { date: "22.01.2025", event: "Accident on Kolhapur-Sangli road; FIR No. 37 of 2025" },
          { date: "Jan-Feb 2025", event: "23 days in hospital; Rs. 3,20,000 spent" },
          { date: "2025", event: "Medical board certifies 30% permanent disability" },
        ],
      },
      analyst: {
        keyFacts: [
          "The truck was insured on the date of the accident (admitted).",
          "An FIR was registered against the driver.",
          "Medical expenses of Rs. 3,20,000 and 30% permanent disability are claimed.",
          "Monthly income of Rs. 18,000 is claimed without salary slips or tax returns.",
          "The owner and driver are ex parte.",
        ],
        issues: [
          "Was the accident caused by the rash and negligent driving of the truck driver?",
          "Is the insurer liable despite the alleged licence breach?",
          "Was there contributory negligence for not wearing a helmet?",
          "What compensation is just, given the proved income and disability?",
        ],
        arguments: [
          { side: "Claimant (Rohan Kulkarni)", points: ["FIR and wrong-side overtaking show the driver's negligence.", "Disability reduces his future earning capacity in field sales."] },
          {
            side: "Insurer (National Assurance Co.)",
            points: ["Driver not licensed for a heavy goods vehicle: breach of policy.", "No helmet: contributory negligence.", "Income not proved by documents."],
          },
        ],
        laws: [
          { law: "Motor Vehicles Act, 1988", section: "Section 166", relevance: "Application for compensation arising out of an accident." },
          { law: "Motor Vehicles Act, 1988", section: "Section 168", relevance: "The Tribunal determines just compensation and who must pay it." },
          { law: "Motor Vehicles Act, 1988", section: "Section 149", relevance: "Insurer's duty to satisfy awards, and the defences it may raise, such as an unlicensed driver." },
        ],
      },
      verifier: {
        agreements: ["Both identify the licence breach as the insurer's main defence.", "Both note the lack of income documents."],
        differences: ["Only the Legal Analyst raises contributory negligence as a separate issue."],
        inconsistencies: [],
        confidence: "Medium",
        confidenceNote: "Liability looks clear, but the amount depends on income proof and the licence defence.",
      },
      chief: {
        overview:
          "This is a compensation claim under Section 166 where negligence appears supported by the FIR and the ex parte owner and driver. The main contests are the insurer's licence defence, a possible reduction for not wearing a helmet, and how income is proved. Even where a licence breach is shown, tribunals have in some cases asked insurers to pay the claimant first and recover from the owner; this should be verified for these facts.",
        keyFindings: [
          "Negligence of the truck driver is supported by the FIR and is not contested by the owner and driver.",
          "The insurer admits the policy; its liability turns on proving the licence breach.",
          "Income needs proof, or the tribunal may assess it notionally.",
          "The 30% disability and medical bills support substantial compensation heads.",
        ],
        sides: [
          { side: "Claimant", strengths: ["FIR", "Medical board certificate", "Hospital bills"], weaknesses: ["No income documents", "No helmet"] },
          { side: "Insurer", strengths: ["Possible licence breach"], weaknesses: ["Policy admitted", "Owner and driver ex parte"] },
        ],
        openQuestions: ["What exactly does the driver's licence cover, and on what date?", "Can the employer confirm the claimant's salary?"],
        nextSteps: ["Obtain a salary certificate or bank statements showing salary credits.", "Get the driver's licence record from the RTO.", "Keep all hospital bills and the disability certificate.", "Consult an advocate on the 'pay and recover' question."],
      },
    },
  },
  {
    id: "farmroad",
    slug: "06-farm-road-injunction-marathi",
    label: "शेतरस्ता (मराठी)",
    hint: "दिवाणी दावा · सातारा",
    text: farmRoadText,
    demo: {
      summarizer: {
        title: "रामचंद्र जाधव विरुद्ध सुरेश पवार",
        caseType: "दिवाणी दावा - शेतरस्त्यासाठी मनाई हुकूम",
        court: "दिवाणी न्यायाधीश (कनिष्ठ स्तर), वडूज, जि. सातारा",
        documentLanguage: "Marathi",
        plainSummary: [
          "रामचंद्र जाधव हे शेतकरी आहेत. त्यांच्या शेतात जाण्यासाठी ते शेजारी सुरेश पवार यांच्या जमिनीतून जाणारा बैलगाडी रस्ता 35 वर्षांहून अधिक काळ वापरत आहेत, असे त्यांचे म्हणणे आहे.",
          "जून 2025 मध्ये, पेरणीच्या आधी, पवार यांनी या रस्त्यावर तारेचे कुंपण घातले आणि चर खणला. त्यामुळे जाधव यांना ट्रॅक्टर आणि बियाणे शेतात नेता येत नाही.",
          "जाधव यांनी अडथळा काढण्याचा आणि पुढे अडथळा न करण्याचा आदेश मागितला आहे. तलाठ्यांच्या पंचनाम्यात रस्ता अडवल्याचे नमूद आहे.",
          "पवार यांचे म्हणणे आहे की असा रस्ता कधीच नव्हता, 7/12 उताऱ्यावर नोंद नाही, जाधव यांना पूर्वेकडून दुसरा रस्ता आहे, आणि हा प्रश्न तहसीलदारांकडे जायला हवा होता.",
        ],
        parties: [
          { name: "श्री. रामचंद्र दत्तात्रय जाधव", role: "वादी - गट नं. 112 चे मालक" },
          { name: "श्री. सुरेश बाळासाहेब पवार", role: "प्रतिवादी - गट नं. 113 चे मालक" },
        ],
        timeline: [
          { date: "35+ वर्षे", event: "गट नं. 113 मधून बैलगाडी रस्त्याचा वापर (वादीनुसार)" },
          { date: "14.06.2025", event: "प्रतिवादीने कुंपण घातले व चर खणला" },
          { date: "18.06.2025", event: "तलाठ्यांचा पंचनामा: रस्ता अडवलेला" },
        ],
      },
      analyst: {
        keyFacts: [
          "वादी 35 वर्षांहून अधिक काळ उघड, शांततापूर्ण आणि हक्काने वापराचा दावा करतात.",
          "14.06.2025 रोजी कुंपण व चर करून रस्ता अडवला गेला.",
          "तलाठ्यांच्या पंचनाम्यात अडथळा नमूद आहे; दोन साक्षीदारांची प्रतिज्ञापत्रे आहेत.",
          "7/12 उताऱ्यावर आणि गाव नकाशावर रस्त्याची नोंद नाही, असे प्रतिवादी म्हणतात.",
          "पूर्वेकडील गावठाण रस्ता पर्यायी मार्ग असल्याचा प्रतिवादीचा दावा आहे.",
        ],
        issues: [
          "वादी यांनी वहिवाटीचा सुखाधिकार (prescriptive easement) सिद्ध केला आहे का?",
          "पूर्वेकडील रस्ता सोयीचा पर्यायी मार्ग आहे का?",
          "दिवाणी न्यायालयाला हा दावा चालवण्याचा अधिकार आहे का, की तहसीलदारांकडे जायला हवे होते?",
          "तात्पुरता मनाई हुकूम देण्याइतपत प्रथमदर्शनी प्रकरण, सोयीचा समतोल आणि भरून न येणारे नुकसान आहे का?",
        ],
        arguments: [
          {
            side: "वादी (रामचंद्र जाधव)",
            points: ["35 वर्षांहून अधिक काळ हक्काने वापर, त्यामुळे सुखाधिकार निर्माण झाला.", "पेरणी थांबल्याने भरून न येणारे नुकसान होत आहे.", "पंचनामा व साक्षीदार अडथळा सिद्ध करतात."],
          },
          {
            side: "प्रतिवादी (सुरेश पवार)",
            points: ["महसूल नोंदींमध्ये रस्ता नाही.", "पूर्वेकडून पर्यायी मार्ग उपलब्ध आहे.", "MLRC कलम 143 अन्वये तहसीलदार योग्य अधिकारी आहेत."],
          },
        ],
        laws: [
          { law: "Indian Easements Act, 1882", section: "Section 15", relevance: "20 वर्षे उघड, शांततापूर्ण आणि हक्काने वापर केल्यास वहिवाटीचा सुखाधिकार मिळतो." },
          { law: "Indian Easements Act, 1882", section: "Section 13", relevance: "गरजेचा सुखाधिकार; पर्यायी मार्ग असल्यास हा मुद्दा कमकुवत होतो." },
          { law: "Specific Relief Act, 1963", section: "Sections 38 and 39", relevance: "कायमचा मनाई हुकूम आणि अडथळा काढण्याचा (mandatory) हुकूम." },
          { law: "Code of Civil Procedure, 1908", section: "Order 39, Rules 1 and 2", relevance: "दावा चालू असताना तात्पुरता मनाई हुकूम." },
          { law: "Maharashtra Land Revenue Code, 1966", section: "Section 143", relevance: "शेताच्या बांधावरून रस्ता देण्याचा तहसीलदारांचा अधिकार; प्रतिवादी यावर अवलंबून आहेत." },
        ],
      },
      verifier: {
        agreements: ["दोघांनीही 35 वर्षांचा वापर, पंचनामा आणि 7/12 वरील नोंद नसणे हे मुख्य मुद्दे ओळखले.", "दोघांनीही पर्यायी रस्त्याचा मुद्दा महत्त्वाचा मानला."],
        differences: ["कायदेशीर विश्लेषकाने वहिवाटीचा सुखाधिकार (कलम 15) आणि गरजेचा सुखाधिकार (कलम 13) वेगळे केले; सारांशकाराने तसे केले नाही."],
        inconsistencies: ["रस्त्याची रुंदी (सुमारे 10 फूट) फक्त वादीच्या कथनात आहे; पंचनाम्यात रुंदी नमूद आहे का, हे दस्तऐवजात स्पष्ट नाही."],
        confidence: "Medium",
        confidenceNote: "तथ्ये स्पष्ट आहेत, पण निकाल वापराचा पुरावा आणि पर्यायी मार्गावर अवलंबून आहे.",
      },
      chief: {
        overview:
          "हा शेतरस्त्यावरील अडथळ्याबाबत मनाई हुकुमाचा दावा आहे. वादी दीर्घकाळ वापरावर आधारित सुखाधिकाराचा दावा करतात, तर प्रतिवादी महसूल नोंदी, पर्यायी मार्ग आणि तहसीलदारांच्या अधिकारक्षेत्रावर भर देतात. न्यायालय आधी तात्पुरत्या मनाई हुकुमासाठी प्रथमदर्शनी प्रकरण, सोयीचा समतोल आणि पेरणीच्या हंगामातील नुकसान पाहील.",
        keyFindings: [
          "35 वर्षांचा वापर सिद्ध झाल्यास कलम 15 अन्वये सुखाधिकार निर्माण होऊ शकतो.",
          "7/12 वर नोंद नसणे हा निर्णायक पुरावा नसतो; प्रत्यक्ष वापराचा पुरावा महत्त्वाचा ठरतो.",
          "पूर्वेकडील रस्ता खरोखर सोयीचा आहे का, यावर गरजेच्या सुखाधिकाराचा मुद्दा अवलंबून आहे.",
          "अधिकारक्षेत्राचा (कलम 143) आक्षेप न्यायालय सुरुवातीला ठरवू शकते.",
        ],
        sides: [
          { side: "वादी", strengths: ["पंचनामा", "दोन साक्षीदार", "फोटो"], weaknesses: ["महसूल नोंदींमध्ये रस्ता नाही"] },
          { side: "प्रतिवादी", strengths: ["7/12 व गाव नकाशा", "पर्यायी मार्गाचा दावा"], weaknesses: ["दीर्घकाळ वापराचा खंडन करणारा पुरावा अद्याप नाही"] },
        ],
        openQuestions: ["पूर्वेकडील गावठाण रस्त्याने ट्रॅक्टर जाऊ शकतो का?", "जुन्या हवाई नकाशांमध्ये किंवा भूमी अभिलेखात हा रस्ता दिसतो का?"],
        nextSteps: ["तात्पुरत्या मनाई हुकुमासाठी पेरणीचे नुकसान दाखवणारे पुरावे जोडा.", "भूमी अभिलेख कार्यालयातून गाव नकाशा व जुने नकाशे मिळवा.", "पर्यायी रस्त्याची प्रत्यक्ष स्थिती दाखवणारे फोटो घ्या.", "दिवाणी प्रकरणांचा अनुभव असलेल्या वकिलाचा सल्ला घ्या."],
      },
    },
  },
  {
    id: "maintenance",
    slug: "07-maintenance-hindi",
    label: "भरण-पोषण (हिन्दी)",
    hint: "BNSS धारा 144 · भोपाल",
    text: maintenanceText,
    demo: {
      summarizer: {
        title: "सुनीता वर्मा बनाम राजेश वर्मा",
        caseType: "भरण-पोषण आवेदन (BNSS धारा 144)",
        court: "कुटुंब न्यायालय, भोपाल",
        documentLanguage: "Hindi",
        plainSummary: [
          "सुनीता वर्मा अपने पति राजेश वर्मा से अपने और अपने 5 साल के बेटे के लिए हर महीने गुज़ारा भत्ता माँग रही हैं।",
          "उनका कहना है कि दहेज के लिए उन्हें प्रताड़ित किया गया और मार्च 2024 में घर से निकाल दिया गया। तब से वे अपने माता-पिता के साथ रहती हैं और उनकी कोई आय नहीं है।",
          "वे अपने लिए ₹15,000 और बेटे के लिए ₹10,000 प्रति माह, और मामला चलने तक अंतरिम भत्ता चाहती हैं।",
          "राजेश का कहना है कि सुनीता खुद घर छोड़कर गईं, उनकी आय केवल ₹22,000 है, और सुनीता पढ़ी-लिखी हैं इसलिए कमा सकती हैं। वे बेटे के लिए ₹4,000 देने को तैयार हैं।",
        ],
        parties: [
          { name: "श्रीमती सुनीता वर्मा एवं पुत्र आरव", role: "आवेदिकागण - पत्नी और नाबालिग पुत्र" },
          { name: "श्री राजेश वर्मा", role: "अनावेदक - पति" },
        ],
        timeline: [
          { date: "12.05.2018", event: "विवाह" },
          { date: "मार्च 2024", event: "आवेदिका को घर से निकाला गया (आवेदिका के अनुसार)" },
          { date: "02.04.2024", event: "महिला थाने में शिकायत" },
        ],
      },
      analyst: {
        keyFacts: [
          "विवाह और पुत्र का जन्म विवादित नहीं है।",
          "पत्नी मार्च 2024 से अलग रह रही है; कारण विवादित है।",
          "पति की आय को लेकर ₹45,000 और ₹22,000 के दो अलग दावे हैं।",
          "पति ने अभी तक वेतन पर्ची या आयकर विवरण नहीं दिया है।",
          "पति पुत्र के लिए ₹4,000 प्रति माह देने को तैयार है।",
        ],
        issues: [
          "क्या पत्नी के पास अलग रहने का पर्याप्त कारण है?",
          "क्या पत्नी स्वयं अपना भरण-पोषण करने में असमर्थ है?",
          "पति की वास्तविक आय कितनी है और उचित राशि क्या होगी?",
          "क्या अंतरिम भरण-पोषण दिया जाना चाहिए?",
        ],
        arguments: [
          { side: "आवेदिका (सुनीता वर्मा)", points: ["दहेज प्रताड़ना के कारण अलग रहना पड़ा; थाने में शिकायत दर्ज है।", "उनकी अपनी कोई आय नहीं है और बच्चा उनके साथ है।"] },
          { side: "अनावेदक (राजेश वर्मा)", points: ["पत्नी बिना कारण घर छोड़कर गई।", "आय केवल ₹22,000 है और माता-पिता की ज़िम्मेदारी है।", "पत्नी स्नातक है और पहले पढ़ाती थी।"] },
        ],
        laws: [
          { law: "Bharatiya Nagarik Suraksha Sanhita, 2023", section: "Section 144", relevance: "पत्नी, बच्चों और माता-पिता के भरण-पोषण का आदेश (पहले CrPC धारा 125)।" },
          { law: "Bharatiya Nagarik Suraksha Sanhita, 2023", section: "Section 144(4)", relevance: "बिना पर्याप्त कारण अलग रहने वाली पत्नी को भरण-पोषण नहीं; अनावेदक इसी पर निर्भर है।" },
          { law: "Bharatiya Nagarik Suraksha Sanhita, 2023", section: "Section 144(1), proviso", relevance: "मामला लंबित रहने के दौरान अंतरिम भरण-पोषण।" },
        ],
      },
      verifier: {
        agreements: ["दोनों ने अलग रहने का कारण और पति की आय को मुख्य विवाद माना।", "दोनों ने ध्यान दिया कि पति ने आय के दस्तावेज़ नहीं दिए।"],
        differences: ["केवल कानूनी विश्लेषक ने धारा 144(4) के बचाव को अलग से बताया।"],
        inconsistencies: [],
        confidence: "Medium",
        confidenceNote: "तथ्य स्पष्ट हैं, पर राशि पति की वास्तविक आय के प्रमाण पर निर्भर करेगी।",
      },
      chief: {
        overview:
          "यह BNSS धारा 144 के तहत पत्नी और नाबालिग पुत्र के भरण-पोषण का आवेदन है। मुख्य प्रश्न हैं कि पत्नी के अलग रहने का पर्याप्त कारण है या नहीं, और पति की वास्तविक आय कितनी है। पति ने आय के दस्तावेज़ नहीं दिए हैं, इसलिए न्यायालय दोनों पक्षों से संपत्ति और आय का शपथपत्र माँग सकता है और अंतरिम भत्ते पर पहले विचार कर सकता है।",
        keyFindings: [
          "पुत्र के भरण-पोषण का दायित्व पति ने आंशिक रूप से स्वीकार किया है।",
          "थाने की शिकायत अलग रहने के कारण के पक्ष में एक प्रारंभिक संकेत है।",
          "पत्नी की कमाने की योग्यता अपने आप भरण-पोषण से वंचित नहीं करती; वास्तविक आय देखी जाती है।",
          "पति की आय का प्रमाण राशि तय करने के लिए निर्णायक होगा।",
        ],
        sides: [
          { side: "आवेदिका", strengths: ["थाने में शिकायत", "बच्चा साथ में", "अपनी आय नहीं"], weaknesses: ["प्रताड़ना के आरोपों का अन्य प्रमाण अभी नहीं"] },
          { side: "अनावेदक", strengths: ["पत्नी की शैक्षणिक योग्यता"], weaknesses: ["आय के दस्तावेज़ नहीं दिए", "पुत्र के लिए दायित्व स्वीकार"] },
        ],
        openQuestions: ["पति की वास्तविक मासिक आय कितनी है?", "क्या पत्नी इस समय कहीं काम कर रही है?"],
        nextSteps: ["अनावेदक से वेतन पर्ची और बैंक विवरण मँगवाने का आवेदन दें।", "दोनों पक्ष संपत्ति और आय का शपथपत्र तैयार रखें।", "बच्चे की पढ़ाई और ख़र्च के प्रमाण संलग्न करें।", "पारिवारिक मामलों के अनुभवी वकील से सलाह लें।"],
      },
    },
  },
];
