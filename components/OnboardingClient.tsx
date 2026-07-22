"use client";

import Link from "next/link";
import { ArrowRight, BellRing, CalendarClock, Check, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { AssessorCore, HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { onboardingSteps } from "@/lib/assistant-core";

export function OnboardingClient() {
  const [step, setStep] = useState(0);
  const progress = Math.round(((step + 1) / onboardingSteps.length) * 100);

  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Ativacao do assessor">
            <span className="eyebrow">
              <Sparkles size={15} /> Etapa {step + 1} de {onboardingSteps.length}
            </span>
            <h1>{onboardingSteps[step]}</h1>
            <p className="premium-copy">{copyByStep(step)}</p>
            <div className="progress-track" aria-label={`Progresso ${progress}%`}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="onboarding-form">
              {renderStep(step)}
              <div className="inline-actions">
                <button className="button secondary" type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                  Voltar
                </button>
                {step < onboardingSteps.length - 1 ? (
                  <button className="button" type="button" onClick={() => setStep((value) => value + 1)}>
                    Continuar <ArrowRight size={17} />
                  </button>
                ) : (
                  <Link className="button" href="/dashboard?payment=approved">
                    Abrir meu dia <ArrowRight size={17} />
                  </Link>
                )}
              </div>
            </div>
          </HolographicPanel>

          <HolographicPanel label="Nucleo ativando">
            <AssessorCore score={progress} label="Ativacao" />
            <div className="stack-list">
              {onboardingSteps.map((item, index) => (
                <div className={`stack-item ${index <= step ? "done" : ""}`} key={item}>
                  <strong>{item}</strong>
                  <span>{index < step ? "Concluido" : index === step ? "Atual" : "Aguardando"}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </section>
      </div>
    </main>
  );
}

function renderStep(step: number) {
  if (step === 0) {
    return (
      <div className="activation-visual">
        <Sparkles size={28} />
        <strong>Assessor em modo demo pronto para configurar sua rotina.</strong>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="info-card">
        <CalendarClock color="#58c7ff" />
        <h3>Google Calendar</h3>
        <p>Conexao preparada. Sem credenciais, o modo demo segue com agenda local.</p>
        <StatusPill tone="amber">Aguardando OAuth</StatusPill>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="info-card">
        <BellRing color="#58c7ff" />
        <h3>Notificacoes</h3>
        <p>Push PWA preparado. O navegador pedira permissao apenas quando voce ativar.</p>
        <label className="checkbox-line">
          <input type="checkbox" defaultChecked /> Ativar lembretes no painel e preparar push.
        </label>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="info-card">
        <MessageCircle color="#58c7ff" />
        <h3>WhatsApp oficial</h3>
        <p>O canal fica desligado ate existir consentimento e credenciais da Cloud API.</p>
        <label className="checkbox-line">
          <input type="checkbox" /> Quero configurar WhatsApp depois.
        </label>
      </div>
    );
  }

  if (step === 9 || step === 10) {
    return (
      <div className="info-card">
        <Check color="#58c7ff" />
        <h3>Primeiro dia gerado</h3>
        <p>Briefing inicial: 3 compromissos, 4 tarefas, uma pendencia critica e uma janela livre para o orcamento.</p>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <div className="field">
        <label htmlFor={`onboarding-${step}`}>{fieldLabel(step)}</label>
        <input id={`onboarding-${step}`} defaultValue={fieldDefault(step)} />
      </div>
    </div>
  );
}

function copyByStep(step: number) {
  const copy = [
    "Vamos acender a central e preparar as permissoes sem enviar nada para fora.",
    "O assessor usa seu nome apenas para personalizar briefing e conversa.",
    "Horario de trabalho ajuda a encontrar janelas livres sem lotar seu dia.",
    "Horario silencioso impede alertas fora do periodo permitido.",
    "Conecte calendario para eventos reais ou continue no modo demo.",
    "Ative notificacoes com consentimento e antecedencia controlada.",
    "WhatsApp oficial e opcional e nunca envia mensagem sem autorizacao.",
    "Compromissos fixos protegem academia, reunioes e recorrencias.",
    "Tres prioridades ajudam a IA a decidir quando tudo parece urgente.",
    "O primeiro dia sera montado com agenda, tarefas e tempo livre.",
    "Veja a primeira notificacao e abra a Central."
  ];
  return copy[step] ?? copy[0];
}

function fieldLabel(step: number) {
  const labels = ["", "Nome", "Horario de trabalho", "Horario silencioso", "", "", "", "Compromissos fixos", "Tres prioridades"];
  return labels[step] ?? "Resposta";
}

function fieldDefault(step: number) {
  const defaults = ["", "Rhuan", "09:00 as 18:00", "22:00 as 07:00", "", "", "", "Academia segunda, quarta e sexta", "Orcamento, estudos, contas"];
  return defaults[step] ?? "";
}
