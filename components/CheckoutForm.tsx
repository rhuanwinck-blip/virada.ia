"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

type CheckoutFormProps = {
  plan: "one-time" | "pro";
  price: string;
};

type CheckoutSessionResponse = {
  checkoutUrl?: string;
};

export function CheckoutForm({ plan, price }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email })
      });

      const session = (await response.json().catch(() => ({}))) as CheckoutSessionResponse;
      if (!response.ok || !session.checkoutUrl) {
        throw new Error("checkout_unavailable");
      }

      window.location.assign(session.checkoutUrl);
    } catch {
      setIsSubmitting(false);
      setError("Nao conseguimos abrir o Mercado Pago agora. Confira o e-mail e tente novamente.");
    }
  }

  return (
    <form action="/api/checkout" className="contact-form" method="post" onSubmit={handleSubmit} style={{ marginTop: 22 }}>
      <input type="hidden" name="plan" value={plan} />
      <label className="field">
        <span>E-mail para receber acesso</span>
        <input
          autoComplete="email"
          disabled={isSubmitting}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          required
          type="email"
          value={email}
        />
      </label>
      {error ? (
        <div className="notice" role="alert">
          <ShieldCheck size={18} /> {error}
        </div>
      ) : null}
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          "Abrindo Mercado Pago..."
        ) : (
          <>
            Pagar {price} no Mercado Pago <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
