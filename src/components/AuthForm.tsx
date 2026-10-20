"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { EMAIL_RE, logIn, signUp } from "@/lib/auth";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type Errors = Partial<Record<"name" | "email" | "password" | "form", string>>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    const next: Errors = {};
    if (isSignup && name.trim().length < 2) next.name = "Enter your name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const error = isSignup ? await signUp(name, email, password) : await logIn(email, password);
    setBusy(false);
    if (error) setErrors({ form: error });
    else router.push("/dashboard");
  }

  const field = (id: "name" | "email" | "password", label: string, type: string, autoComplete: string) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        className="input"
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        required
      />
      {errors[id] && (
        <span id={`${id}-error`} className="field-error">
          {errors[id]}
        </span>
      )}
    </div>
  );

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <main className="auth-wrap" id="main">
        <div className="card auth-card">
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="sub">{isSignup ? "Start analyzing case documents in minutes." : "Log in to your LexAgent dashboard."}</p>
          <form onSubmit={onSubmit} noValidate>
            {errors.form && (
              <p className="form-error" role="alert">
                {errors.form}
              </p>
            )}
            {isSignup && field("name", "Full name", "text", "name")}
            {field("email", "Email", "email", "email")}
            {field("password", "Password", "password", isSignup ? "new-password" : "current-password")}
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy && <span className="spinner" aria-hidden="true" />}
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
          <p className="auth-switch">
            {isSignup ? "Already have an account? " : "New to LexAgent? "}
            <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
          </p>
          <p className="demo-note">Demo sign-in: accounts are saved only in this browser and are not real accounts yet.</p>
        </div>
      </main>
    </>
  );
}
