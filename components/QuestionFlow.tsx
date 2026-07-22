"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PillarRadar, ProgressCore, ScannerPanel } from "@/components/PremiumVisuals";
import { saveAnswers, saveContact } from "@/lib/local-store";
import { AnswerMap, painOptions, questions } from "@/lib/questions";
import { scoreDiagnostic } from "@/lib/scoring";

const scaleLabels = ["Nunca", "Raro", "Às vezes", "Muito", "Sempre"];

export function QuestionFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [contact, setContact] = useState({
    name: "",
    email: "",
    ageRange: "25-34",
    mainPain: painOptions[0],
    marketingConsent: true
  });

  const isContactStep = step >= questions.length;
  const progress = Math.round((Math.min(step, questions.length) / questions.length) * 100);
  const question = questions[step];
  const liveResult = useMemo(() => scoreDiagnostic({ ...answers }), [answers]);
  const canGoNext = isContactStep
    ? contact.name.trim().length > 1 && /.+@.+\..+/.test(contact.email)
    : answers[question.key] !== undefined;

  const sidebar = useMemo(
    () => [
      ["Tempo estimado", "4 minutos"],
      ["Perguntas", `${questions.length}`],
      ["Progresso", `${progress}%`],
      ["Cartão", "Não precisa"]
    ],
    [progress]
  );

  function select(value: number) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    saveAnswers(next);
  }

  function next() {
    if (!canGoNext) return;
    if (isContactStep) {
      saveContact(contact);
      saveAnswers(answers);
      router.push("/resultado");
      return;
    }
    setStep((value) => value + 1);
  }

  return (
    <div className="quiz-layout">
      <main className="panel quiz-card">
        <div className="progress-track" aria-label={`Progresso ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>

        {isContactStep ? (
          <>
            <span className="eyebrow" style={{ marginTop: 28 }}>
              <CheckCircle2 size={16} /> Resultado quase pronto
            </span>
            <h1 className="question-title">Para liberar seu resultado gratuito, confirme seu contato.</h1>
            <p className="question-helper">
              O e-mail é usado para enviar o resultado e retomar o diagnóstico. Marketing só com consentimento.
            </p>
            <div className="contact-form" style={{ marginTop: 26 }}>
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  value={contact.name}
                  onChange={(event) => setContact({ ...contact, name: event.target.value })}
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  value={contact.email}
                  onChange={(event) => setContact({ ...contact, email: event.target.value })}
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <div className="field">
                <label htmlFor="age">Faixa de idade</label>
                <select
                  id="age"
                  value={contact.ageRange}
                  onChange={(event) => setContact({ ...contact, ageRange: event.target.value })}
                >
                  <option value="18-24">18 a 24</option>
                  <option value="25-34">25 a 34</option>
                  <option value="35-44">35 a 44</option>
                  <option value="45-54">45 a 54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="pain">Principal dor percebida</label>
                <select
                  id="pain"
                  value={contact.mainPain}
                  onChange={(event) => setContact({ ...contact, mainPain: event.target.value })}
                >
                  {painOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={contact.marketingConsent}
                  onChange={(event) => setContact({ ...contact, marketingConsent: event.target.checked })}
                />
                Aceito receber acompanhamento e conteúdos úteis por e-mail. Posso cancelar quando quiser.
              </label>
            </div>
          </>
        ) : (
          <>
            <span className="eyebrow" style={{ marginTop: 28 }}>
              Pergunta {step + 1} de {questions.length}
            </span>
            <h1 className="question-title">{question.label}</h1>
            <p className="question-helper">{question.helper}</p>

            {question.kind === "scale" ? (
              <div className="scale-row" role="radiogroup" aria-label={question.label}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    className={`option-button ${answers[question.key] === value ? "selected" : ""}`}
                    key={value}
                    onClick={() => select(value)}
                    type="button"
                  >
                    <strong>{value}</strong>
                    <br />
                    <span style={{ fontSize: 12 }}>{scaleLabels[value - 1]}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="choice-row" role="radiogroup" aria-label={question.label}>
                {question.options?.map((option) => (
                  <button
                    className={`option-button ${answers[question.key] === option.value ? "selected" : ""}`}
                    key={option.label}
                    onClick={() => select(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <div className="quiz-actions">
          <button
            className="button ghost"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            type="button"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <button className="button" disabled={!canGoNext} onClick={next} type="button">
            {isContactStep ? "Ver resultado gratuito" : "Avançar"} <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <aside className="dashboard-section">
        <ScannerPanel label="Análise em tempo real">
          <ProgressCore score={liveResult.viradaIndex} confidence={liveResult.confidence} trend={`${progress}% respondido`} />
          <PillarRadar scores={liveResult.pillarScores} compact />
          <p style={{ color: "var(--secondary)", lineHeight: 1.6 }}>
            Suas respostas geram uma leitura educacional de hábitos. Não há julgamento e não há promessa de resultado
            garantido.
          </p>
        </ScannerPanel>
        <ScannerPanel label="Segurança">
          <div className="bar-list">
            {sidebar.map(([label, value]) => (
              <div className="bar-label" key={label}>
                <span>{label}</span>
                <strong style={{ color: "var(--text)" }}>{value}</strong>
              </div>
            ))}
          </div>
        </ScannerPanel>
      </aside>
    </div>
  );
}
