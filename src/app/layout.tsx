import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Devanagari fallbacks for Hindi and Marathi; only downloaded when Devanagari text is on the page.
const devaSans = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-deva-sans", display: "swap", preload: false });
const devaSerif = Noto_Serif_Devanagari({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-deva-serif", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "LexAgent · Multi-agent legal case analysis",
  description:
    "Upload an Indian legal case document and four AI agents summarize it, extract legal insights, cross-check each other and write a final analysis you can export as PDF.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a1c" },
  ],
};

// Applies the saved theme before first paint, so there is no flash of the wrong theme.
const themeScript = `try{var t=localStorage.getItem("lexagent.theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var l=localStorage.getItem("lexagent.lang");if(l==="hi"||l==="mr")document.documentElement.lang=l}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${devaSans.variable} ${devaSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
