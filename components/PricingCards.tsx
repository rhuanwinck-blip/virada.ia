import Link from "next/link";
import { Check, LockKeyhole } from "lucide-react";
import { planTiers } from "@/lib/questions";

export function PricingCards() {
  return (
    <div className="offer-grid">
      {planTiers.map((tier) => (
        <article className={`price-card ${tier.featured ? "featured" : ""}`} key={tier.key}>
          <div style={{ color: tier.accent, fontWeight: 800 }}>{tier.featured ? "Oferta principal" : "Plano"}</div>
          <h3 style={{ marginTop: 10 }}>{tier.name}</h3>
          <div className="price">{tier.price}</div>
          <ul className="check-list">
            {tier.bullets.map((bullet) => (
              <li key={bullet}>
                <Check size={17} color={tier.accent} /> <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Link
            className={`button ${tier.featured ? "" : "secondary"}`}
            style={{ marginTop: 22, width: "100%" }}
            href={tier.key === "free" ? "/diagnostico" : `/checkout?plan=${tier.key === "pro" ? "pro" : "one-time"}`}
          >
            {tier.key === "free" ? "Começar gratuito" : "Desbloquear plano"} <LockKeyhole size={17} />
          </Link>
        </article>
      ))}
    </div>
  );
}
