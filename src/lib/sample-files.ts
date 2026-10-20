// Ready-made case files in /sample-cases (copied to public/sample-cases at install), for trying uploads.
export const SAMPLE_FILES = [
  { slug: "01-cheque-bounce-ni-act", title: "Cheque bounce · NI Act s.138 · Pune" },
  { slug: "02-defective-phone-consumer", title: "Defective phone · Consumer Protection Act · Nashik" },
  { slug: "03-job-fraud-cheating-bns", title: "Job-offer fraud · BNS s.318 · Nagpur" },
  { slug: "04-tenant-eviction-rent-act", title: "Tenant eviction · Maharashtra Rent Control Act · Mumbai" },
  { slug: "05-motor-accident-claim", title: "Road accident claim · Motor Vehicles Act s.166 · Kolhapur" },
] as const;

export const SAMPLE_FORMATS = ["pdf", "docx", "txt"] as const;
