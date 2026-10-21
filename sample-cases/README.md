# Sample cases

Fictional Indian case documents for trying LexAgent's upload, in **English, Marathi and Hindi**, because district courts
often work in the local language. Names, numbers and parties are invented; these are not real court records.

| # | Case | Language | Law | Files |
|---|---|---|---|---|
| 01 | Cheque bounce, Pune | English | Negotiable Instruments Act, 1881 · s.138 | [PDF](01-cheque-bounce-ni-act.pdf) · [DOCX](01-cheque-bounce-ni-act.docx) · [TXT](01-cheque-bounce-ni-act.txt) |
| 02 | Defective phone, Nashik | English | Consumer Protection Act, 2019 | [PDF](02-defective-phone-consumer.pdf) · [DOCX](02-defective-phone-consumer.docx) · [TXT](02-defective-phone-consumer.txt) |
| 03 | Job-offer fraud bail, Nagpur | English | BNS s.318(4), 336(3), 340(2) · BNSS s.480 | [PDF](03-job-fraud-cheating-bns.pdf) · [DOCX](03-job-fraud-cheating-bns.docx) · [TXT](03-job-fraud-cheating-bns.txt) |
| 04 | Tenant eviction, Mumbai | English | Maharashtra Rent Control Act, 1999 · s.15, s.16 | [PDF](04-tenant-eviction-rent-act.pdf) · [DOCX](04-tenant-eviction-rent-act.docx) · [TXT](04-tenant-eviction-rent-act.txt) |
| 05 | Road accident claim, Kolhapur | English | Motor Vehicles Act, 1988 · s.166 | [PDF](05-motor-accident-claim.pdf) · [DOCX](05-motor-accident-claim.docx) · [TXT](05-motor-accident-claim.txt) |
| 06 | शेतरस्ता मनाई हुकूम, वडूज (सातारा) | मराठी | Indian Easements Act s.15 · Specific Relief Act s.38–39 · MLRC s.143 | [PDF (scan)](06-farm-road-injunction-marathi.pdf) · [DOCX](06-farm-road-injunction-marathi.docx) · [TXT](06-farm-road-injunction-marathi.txt) |
| 07 | भरण-पोषण, कुटुंब न्यायालय भोपाल | हिन्दी | BNSS s.144 | [PDF (scan)](07-maintenance-hindi.pdf) · [DOCX](07-maintenance-hindi.docx) · [TXT](07-maintenance-hindi.txt) |

**How to use:** open LexAgent, log in, and drop any file from this folder onto *File a case*, then press **Analyze Case**.
On the live site the same files are linked under *Download sample case files* on the dashboard.

**Why are the Marathi and Hindi PDFs scans?** Real district-court copies usually are, and Devanagari PDFs that do have a
text layer often extract scrambled. LexAgent handles both: it detects a missing or broken text layer and reads the page
images with OCR (Marathi, Hindi and English) in your browser, then asks you to check the text. Upload one of these PDFs to
watch it work page by page.

Without an AI key, LexAgent runs in demo mode: it recognises these files and shows their stored analysis, and it refuses any
other document instead of showing the wrong case.

Regenerate the files with `npm run samples` (source: `scripts/make-sample-cases.tsx`).
