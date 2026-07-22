"use client";

import Link from "next/link";
import { Download, FileText, LockKeyhole, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AICompanionPreview, ConnectedNodes, PillarRadar, PlanTimeline, ProgressCore, ScannerPanel, StatusPill } from "@/components/PremiumVisuals";
import { PricingCards } from "@/components/PricingCards";
import { demoAnswers, disclaimer } from "@/lib/questions";
import { loadAnswers } from "@/lib/local-store";
import { DiagnosticResult, getScoreBand, scoreDiagnostic } from "@/lib/scoring";
import { behaviorPatterns } from "@/lib/product-experience";

export function ResultClient() {
  const [result, setResult] = useState<DiagnosticResult>(() => scoreDiagnostic(demoAnswers));

  useEffect(() => {
    setResult(scoreDiagnostic(loadAnswers() ?? demoAnswers));
  }, []);

  return (
    <main className="result-shell">
      <div className="grid-background" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <ScannerPanel className="dashboard-card" label="Resultado gratuito personalizado">
            <span className="eyebrow">
              <Sparkles size={15} /> Seu ponto de virada
            </span>
            <h1 style={{ marginTop: 18, fontSize: "clamp(2.2rem, 6vw, 5rem)" }}>
              {result.mainBlocker.name} é a prioridade mais realista para começar.
            </h1>
            <p className="premium-copy">{result.pattern}</p>
            <div className="metric-grid">
              <ProgressCore score={result.viradaIndex} confidence={result.confidence} trend={getScoreBand(result.viradaIndex)} />
              <ScannerPanel label="Ação imediata">
                <h3 style={{ marginTop: 12 }}>{result.freeAction}</h3>
                <p className="premium-copy">Essa é a menor ação útil antes do plano completo.</p>
              </ScannerPanel>
            </div>
          </ScannerPanel>

          <ScannerPanel label="Radar dos pilares">
            <PillarRadar scores={result.pillarScores} />
          </ScannerPanel>
        </section>

        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <span className="eyebrow">Evidências e limites</span>
            <h2>O resultado mostra por que a recomendação apareceu.</h2>
          </div>
          <div className="cards-grid">
            {result.topBlockers.map((pillar, index) => (
              <article className="info-card" key={pillar.key}>
                <StatusPill tone={index === 0 ? "green" : "blue"}>{index === 0 ? "Principal" : "Secundário"}</StatusPill>
                <h3 style={{ marginTop: 12 }}>{pillar.name}</h3>
                <p>{pillar.description}</p>
                <div className="pillar-score">
                  <span style={{ width: `${pillar.score}%`, background: pillar.color }} />
                </div>
              </article>
            ))}
          </div>
          {result.contradictions.length ? (
            <ConnectedNodes
              items={result.contradictions.map((item) => ({
                title: item.title,
                detail: item.detail,
                tone: item.severity === "high" ? "gold" : "blue"
              }))}
            />
          ) : (
            <div className="notice" style={{ marginTop: 16 }}>
              Nenhuma contradição forte apareceu nas respostas. A confiança depende da completude do questionário.
            </div>
          )}
        </section>

        <section className="section">
          <div className="dashboard-grid">
            <ScannerPanel className="dashboard-card" label="Prévia do plano completo">
              <h2>O que fica liberado após o pagamento.</h2>
              <p className="premium-copy">
                Plano de 30 dias, rotinas, versões mínimas, relatórios e assistente IA com contexto do diagnóstico.
              </p>
              <PlanTimeline missions={result.thirtyDayPlan} />
              <div className="mission-actions" style={{ marginTop: 18 }}>
                <Link className="button" href="/checkout?plan=one-time">
                  Desbloquear plano completo <LockKeyhole size={18} />
                </Link>
                <a className="button secondary" href="/api/report">
                  Baixar PDF demo <Download size={18} />
                </a>
                <Link className="button ghost" href="/diagnostico">
                  Refazer análise <RefreshCcw size={18} />
                </Link>
              </div>
            </ScannerPanel>

            <aside className="dashboard-section">
              <ScannerPanel label="Relatório bloqueado">
                <FileText color="#d4ba74" size={28} />
                <h3 style={{ marginTop: 12 }}>Camadas premium</h3>
                <ul className="check-list" style={{ marginTop: 14 }}>
                  {result.preview.map((item) => (
                    <li key={item}>
                      <LockKeyhole size={16} color="#d4ba74" /> {item}
                    </li>
                  ))}
                </ul>
              </ScannerPanel>
              <AICompanionPreview result={result} />
            </aside>
          </div>
        </section>

        <section className="section alt">
          <div className="section-header">
            <span className="eyebrow">Padrões prováveis</span>
            <h2>O sistema olha para comportamento, não para culpa.</h2>
          </div>
          <ConnectedNodes items={behaviorPatterns.map((pattern) => ({ title: pattern.title, detail: pattern.action }))} />
        </section>

        <section className="section" id="oferta">
          <div className="section-header center">
            <span className="eyebrow">Oferta transparente</span>
            <h2>Comece gratuito ou desbloqueie acompanhamento completo.</h2>
            <p>Sem urgência falsa, sem depoimento inventado e sem promessa garantida.</p>
          </div>
          <PricingCards />
          <div className="notice" style={{ marginTop: 18 }}>
            <ShieldCheck size={18} /> {disclaimer}
          </div>
        </section>
      </div>
    </main>
  );
}
