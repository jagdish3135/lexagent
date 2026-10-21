import Link from "next/link";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill="var(--primary)" />
      <g fill="none" stroke="var(--on-primary)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 14v34M22 48h20M18 22h28" />
        <path d="M18 22l-7 14h14zM46 22l-7 14h14z" />
      </g>
      <circle cx="32" cy="14" r="3.6" fill="var(--on-primary)" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="LexAgent home">
      <LogoMark />
      <span>
        Lex<em>Agent</em>
      </span>
    </Link>
  );
}

export function ScalesIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 12v38M20 50h24M16 20h32M16 20l-8 15h16zM48 20l-8 15h16z" />
    </svg>
  );
}
