"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { EMAIL_RE, logIn, signUp } from "@/lib/auth";
import { useLang, type Key } from "@/lib/i18n";
import { ROLES, isRole, type Role } from "@/lib/locale";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type Field = "name" | "email" | "password";
type Errors = Partial<Record<Field | "form", Key>>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { t } = useLang();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const roleRaw = data.get("role");
    const role: Role = isRole(roleRaw) ? roleRaw : "citizen";

    const next: Errors = {};
    if (isSignup && name.trim().length < 2) next.name = "err.name";
    if (!EMAIL_RE.test(email.trim())) next.email = "err.email";
    if (password.length < 6) next.password = "err.password";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const error = isSignup ? await signUp(name, email, password, role) : await logIn(email, password);
    setBusy(false);
    if (error) setErrors({ form: error === "exists" ? "err.exists" : "err.wrong" });
    else router.push("/dashboard");
  }

  const field = (id: Field, label: Key, type: string, autoComplete: string) => (
    <div className="field">
      <label htmlFor={id}>{t(label)}</label>
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
          {t(errors[id])}
        </span>
      )}
    </div>
  );

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Logo />
          <div className="header-actions">
            <LangSwitch />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="auth-split" id="main">
        <aside className="auth-art" aria-hidden="true">
          <span className="kicker" style={{ color: "var(--seal)" }}>
            Article 39A
          </span>
          <div>
            <blockquote>
              The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity.
            </blockquote>
            <cite>{t("auth.cite")}</cite>
          </div>
          <div className="art-foot">
            {(["summarizer", "analyst", "verifier", "chief"] as const).map((a) => (
              <span key={a}>{t(`agent.${a}` as Key)}</span>
            ))}
          </div>
        </aside>
        <div className="auth-wrap">
          <div className="auth-card">
            <span className="kicker">{t(isSignup ? "auth.signup.kicker" : "auth.login.kicker")}</span>
            <h1>
              {t(isSignup ? "auth.signup.h1a" : "auth.login.h1a")} <em>{t(isSignup ? "auth.signup.h1em" : "auth.login.h1em")}</em>
            </h1>
            <p className="sub">{t(isSignup ? "auth.signup.sub" : "auth.login.sub")}</p>
            <form onSubmit={onSubmit} noValidate>
              {errors.form && (
                <p className="form-error" role="alert">
                  {t(errors.form)}
                </p>
              )}
              {isSignup && field("name", "auth.name", "text", "name")}
              {field("email", "auth.email", "email", "email")}
              {field("password", "auth.password", "password", isSignup ? "new-password" : "current-password")}
              {isSignup && (
                <fieldset className="roles">
                  <legend>{t("auth.role")}</legend>
                  {ROLES.map((r, n) => (
                    <label key={r} className="role-opt">
                      <input type="radio" name="role" value={r} defaultChecked={n === 0} />
                      <b>{t(`role.${r}` as Key)}</b>
                      <span>{t(`role.${r}.d` as Key)}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={busy}>
                {busy && <span className="spinner" aria-hidden="true" />}
                {t(isSignup ? "auth.create" : "auth.login")}
              </button>
            </form>
            <p className="auth-switch">
              {t(isSignup ? "auth.haveAccount" : "auth.newHere")}{" "}
              <Link href={isSignup ? "/login" : "/signup"} className="text-link">
                {t(isSignup ? "auth.login" : "auth.toSignup")}
              </Link>
            </p>
            <p className="demo-note">{t("auth.demo")}</p>
          </div>
        </div>
      </main>
    </>
  );
}
