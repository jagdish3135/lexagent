import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Dateline({ right = "Decision support · not a decision" }: { right?: string }) {
  return (
    <div className="dateline mono" aria-hidden="true">
      <div className="container">
        <span>Vol. I · No. 1 · For the people of India</span>
        <span className="hide-sm">{right}</span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <>
      <Dateline />
      <header className="site-header">
        <div className="container">
          <Logo />
          <nav className="header-actions" aria-label="Main">
            <div className="nav-links">
              <a href="#proceedings">Proceedings</a>
              <a href="#bench">The bench</a>
              <a href="#readers">Readers</a>
            </div>
            <ThemeToggle />
            <Link href="/login" className="btn btn-ghost hide-sm">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              File a case
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
