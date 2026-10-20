# Sample cases

Fictional Indian case documents for trying LexAgent's upload. Each case comes as **PDF**, **DOCX** and **TXT**.
Names, numbers and parties are invented; these are not real court records.

| # | Case | Law | Try it for |
|---|---|---|---|
| 01 | [Cheque bounce, Pune](01-cheque-bounce-ni-act.pdf) | Negotiable Instruments Act, 1881 · s.138 | Criminal complaint, statutory presumptions |
| 02 | [Defective phone, Nashik](02-defective-phone-consumer.pdf) | Consumer Protection Act, 2019 | Consumer complaint, deficiency in service |
| 03 | [Job-offer fraud, Nagpur](03-job-fraud-cheating-bns.pdf) | BNS s.318(4), s.336(3), s.340(2) · BNSS s.480 | Bail application under the new criminal laws |
| 04 | [Tenant eviction, Mumbai](04-tenant-eviction-rent-act.pdf) | Maharashtra Rent Control Act, 1999 · s.15, s.16(1)(g) | Civil suit with arrears and bona fide need |
| 05 | [Road accident claim, Kolhapur](05-motor-accident-claim.pdf) | Motor Vehicles Act, 1988 · s.166 | Compensation claim with an insurer's defence |

**How to use:** open LexAgent, log in, and drop any file from this folder onto *File a case*, then press **Analyze Case**.
On the live site the same files are linked under *Download sample case files* on the dashboard.

Regenerate them with `npm run samples` (source: `scripts/make-sample-cases.tsx`).
