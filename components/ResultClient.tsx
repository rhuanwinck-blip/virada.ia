"use client";

import Link from "next/link";
import { Download, LockKeyhole, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { demoAnswers, disclaimer } from "@/lib/questions";
import { loadAnswers } from "@/lib/local-store";
import { DiagnosticResult, getScoreBand, scoreDiagnostic } from "@/lib/scoring";
import { ProductMockup } from "@/components/ProductMockup";
import { PricingCards } from "@/components/PricingCards";

export function ResultClient() {
  const [result, setResult] = useState<DiagnosticResult>(() => scoreDiagnostic(demoAnswers));

  useEffect(() => {
    setResult(scoreDiagnostic(loadAnswers() ?? demoAnswers));
  }, []);

  return (
    <main className="result-shell">
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <div className="result-grid" style={{ marginTop: 28 }}>
          <section>
            <ProductMockup result={result} />
            <div className="panel" style={{ padding: 26, marginTop: 16 }}>
              <span className="eyebrow">Ponto de virada</span>
              <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                {result.mainBlocker.name} é a prioridade mais realista para começar.
              </h1>
              <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>{result.pattern}</p>
              <div className="notice">{disclaimer}</div>
            </div>
          </section>

          <aside className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1.4rem" }}>Resultado gratuito</h2>
            <div style={{ color: "var(--secondary)", lineHeight: 1.8 }}>
              <p>
                Índice: <strong style={{ color: "var(--text)" }}>{result.viradaIndex}/100</strong>
              </p>
              <p>
                Faixa: <strong style={{ color: "var(--text)" }}>{getScoreBand(result.viradaIndex)}</strong>
              </p>
              <p>
                Confiança: <strong style={{ color: "var(--text)" }}>{result.confidence}</strong>
              </p>
            </div>
            <div className="notice" style={{ marginTop: 14 }}>
              {result.freeAction}
            </div>
            <h3 style={{ marginTop: 24 }}>Prévia bloqueada</h3>
            <ul className="check-list" style={{ marginTop: 14 }}>
              {result.preview.map((item) => (
                <li key={item}>
                  <LockKeyhole size={16} color="#D6B978" /> {item}
                </li>
              ))}
            </ul>
            <Link className="button" style={{ width: "100%", marginTop: 22 }} href="/checkout?plan=one-time">
              Desbloquear plano completo <LockKeyhole size={18} />
            </Link>
            <a className="button secondary" style={{ width: "100%", marginTop: 10 }} href="/api/report">
              Baixar PDF demo <Download size={18} />
            </a>
            <Link className="button ghost" style={{ width: "100%", marginTop: 10 }} href="/diagnostico">
              Refazer análise <RefreshCcw size={18} />
            </Link>
          </aside>
        </div>

        <section className="section" id="oferta">
          <div className="section-header">
            <span className="eyebrow">Oferta sem pressão artificial</span>
            <h2>Não tente mudar sua vida inteira. Comece pelo plano certo.</h2>
          </div>
          <PricingCards />
        </section>
      </div>
    </main>
  );
}
