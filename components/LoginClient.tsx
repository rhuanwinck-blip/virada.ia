"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type LoginMode = "acesso" | "login" | "cadastro";

type LoginClientProps = {
  initialMode: LoginMode;
  nextPath: string;
  notice?: string;
};

export function LoginClient({ initialMode, nextPath, notice }: LoginClientProps) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(notice ?? "");
  const [error, setError] = useState("");
  const safeNextPath = useMemo(() => normalizeClientNextPath(nextPath), [nextPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setIsSubmitting(false);
      setError("Supabase Auth nao esta configurado neste ambiente.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (mode === "acesso") {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNextPath)}`
        }
      });

      if (otpError) {
        setIsSubmitting(false);
        setError(formatAuthError(otpError.message));
        return;
      }

      setIsSubmitting(false);
      setMessage("Enviamos um link de acesso para seu e-mail. Abra o e-mail neste mesmo navegador para liberar sua conta.");
      return;
    }

    const authResult =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
        : await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              data: { full_name: name.trim() },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNextPath)}`
            }
          });

    if (authResult.error) {
      setIsSubmitting(false);
      setError(formatAuthError(authResult.error.message));
      return;
    }

    if (mode === "cadastro" && !authResult.data.session) {
      setIsSubmitting(false);
      setMessage("Senha criada. Confirme seu e-mail e depois volte para entrar.");
      return;
    }

    await fetch("/api/auth/claim", { method: "POST" }).catch(() => null);
    window.location.assign(safeNextPath);
  }

  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Conta Virada IA">
            <span className="eyebrow">
              <LockKeyhole size={15} /> Acesso seguro
            </span>
            <h1>{getModeTitle(mode)}</h1>
            <p className="premium-copy">{getModeCopy(mode)}</p>

            <div className="inline-actions" role="tablist" aria-label="Modo de acesso" style={{ margin: "22px 0 18px" }}>
              <button className={`button ${mode === "acesso" ? "" : "secondary"}`} type="button" onClick={() => setMode("acesso")}>
                Acesso por e-mail
              </button>
              <button className={`button ${mode === "login" ? "" : "secondary"}`} type="button" onClick={() => setMode("login")}>
                Tenho senha
              </button>
              <button className={`button ${mode === "cadastro" ? "" : "secondary"}`} type="button" onClick={() => setMode("cadastro")}>
                Criar senha
              </button>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              {mode === "cadastro" ? (
                <label className="field">
                  <span>Nome</span>
                  <input autoComplete="name" disabled={isSubmitting} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" type="text" value={name} />
                </label>
              ) : null}
              <label className="field">
                <span>E-mail</span>
                <input
                  autoComplete="email"
                  disabled={isSubmitting}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  required
                  type="email"
                  value={email}
                />
              </label>
              {mode !== "acesso" ? (
                <label className="field">
                  <span>Senha</span>
                  <input
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    disabled={isSubmitting}
                    minLength={6}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo 6 caracteres"
                    required
                    type="password"
                    value={password}
                  />
                </label>
              ) : null}
              {message ? (
                <div className="notice" role="status">
                  <ShieldCheck size={18} /> {message}
                </div>
              ) : null}
              {error ? (
                <div className="notice" role="alert">
                  <ShieldCheck size={18} /> {error}
                </div>
              ) : null}
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Validando acesso..." : getSubmitLabel(mode)} <ArrowRight size={17} />
              </button>
            </form>
          </HolographicPanel>

          <HolographicPanel label="Depois do pagamento">
            <StatusPill tone="amber">
              <Mail size={14} /> Mesmo e-mail
            </StatusPill>
            <div className="stack-list" style={{ marginTop: 20 }}>
              <div className="stack-item done">
                <strong>Comprou no Mercado Pago</strong>
                <span>O webhook grava o acesso para o e-mail do comprador.</span>
              </div>
              <div className="stack-item">
                <strong>Ativou por e-mail</strong>
                <span>O link seguro cria a sessao sem exigir uma senha antiga.</span>
              </div>
              <div className="stack-item">
                <strong>Dashboard liberado</strong>
                <span>O Virada IA consulta acesso ativo antes de abrir areas privadas.</span>
              </div>
            </div>
            <div className="notice" style={{ marginTop: 18 }}>
              <UserRound size={18} /> Ja comprou? Use o mesmo e-mail do checkout para receber o link.
            </div>
          </HolographicPanel>
        </section>
      </div>
    </main>
  );
}

function getModeTitle(mode: LoginMode) {
  if (mode === "acesso") return "Ative seu acesso pelo e-mail da compra.";
  if (mode === "cadastro") return "Crie sua senha para entrar.";
  return "Entre com sua senha.";
}

function getModeCopy(mode: LoginMode) {
  if (mode === "acesso") return "Nao precisa ter senha cadastrada. Enviamos um link seguro para o e-mail usado no Mercado Pago.";
  if (mode === "cadastro") return "Use o mesmo e-mail do Mercado Pago e escolha uma senha para proximos acessos.";
  return "Use esta opcao apenas se voce ja criou uma senha antes.";
}

function getSubmitLabel(mode: LoginMode) {
  if (mode === "acesso") return "Enviar link de acesso";
  if (mode === "cadastro") return "Criar senha";
  return "Entrar";
}

function normalizeClientNextPath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\n")) return "/dashboard";
  return value;
}

function formatAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (normalized.includes("password")) return "Confira a senha. Ela precisa ter pelo menos 6 caracteres.";
  return "Nao conseguimos validar seu acesso agora. Tente novamente.";
}
