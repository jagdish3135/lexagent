import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Logo />
        <nav className="header-actions" aria-label="Main">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost hide-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
