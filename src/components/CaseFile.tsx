import type { CSSProperties } from "react";

// Hero piece: a case sheet that the four agents highlight and annotate in turn, then stamp.
// Pure CSS animation (see .casefile in globals.css); reduced-motion users see the finished sheet.
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const NOTES = [
  { n: "1", who: "Summarizer", text: "A ₹4.5 lakh cheque bounced; the dealer wants it paid.", c: "c-blue", at: 1.3 },
  { n: "2", who: "Legal Analyst", text: "NI Act §138 offence; §139 presumes a debt.", c: "c-amber", at: 1.7 },
  { n: "3", who: "Cross-Verifier", text: "Cheque ≠ ledger: ₹30,000 gap unexplained.", c: "c-green", at: 2.5 },
  { n: "4", who: "Chief Analyst", text: "Timelines met. The case turns on the ‘security cheque’ defence.", c: "c-red", at: 3.0 },
];

export function CaseFile() {
  return (
    <figure className="casefile" aria-label="A sample case file being annotated by the four LexAgent agents" style={{ margin: 0 }}>
      <div className="sheet">
        <div className="sheet-head mono">
          <span>Crl. Complaint 1452/2025</span>
          <span>JMFC · Pune</span>
        </div>
        <p className="court">In the Court of the Judicial Magistrate</p>
        <p className="versus">Shree Ganesh Traders v. Rakesh Patil</p>
        <p className="para">
          1. Between August and November 2024 the Complainant supplied goods worth Rs. 4,80,000 to the Accused on credit.{" "}
          <mark className="c-blue" style={d(0.5)}>
            Towards part payment the Accused issued cheque No. 004512 for Rs. 4,50,000
          </mark>
          , which was{" "}
          <mark className="c-amber" style={d(0.9)}>
            returned unpaid on 17.01.2025 with the remark “Funds Insufficient”.
          </mark>
        </p>
        <p className="para">
          2. A legal notice was delivered on 08.02.2025. The Accused neither paid nor replied.{" "}
          <mark className="c-green" style={d(1.8)}>
            The Accused admits his signature but says the cheque was a blank “security” cheque
          </mark>{" "}
          given in 2023, and that{" "}
          <mark className="c-red" style={d(2.3)}>
            part of the goods were defective and returned.
          </mark>
        </p>
        <div className="stamp" aria-hidden="true">
          <span>
            Analysed
            <big>4 agents</big>
            LexAgent
          </span>
        </div>
      </div>
      <figcaption className="marginalia">
        {NOTES.map((note) => (
          <div key={note.n} className={`note ${note.c}`} style={d(note.at)}>
            <span className="n">{note.n}</span>
            <span>
              <b>{note.who}</b>
              {note.text}
            </span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
