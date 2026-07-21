import { DiagnosticResult } from "@/lib/scoring";

export function ProductMockup({ result }: { result: DiagnosticResult }) {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="score-hero" style={{ padding: 0 }}>
        <div className="score-dial" style={{ "--score": result.viradaIndex } as React.CSSProperties}>
          <div className="score-dial-inner">
            <div>
              <div className="score-number">{result.viradaIndex}</div>
              <div style={{ color: "var(--muted)", textAlign: "center" }}>/100</div>
            </div>
          </div>
        </div>
        <div>
          <span className="eyebrow">Resultado gratuito</span>
          <h3 style={{ marginTop: 16, fontSize: "2rem" }}>{result.mainBlocker.name}</h3>
          <p style={{ color: "var(--secondary)", lineHeight: 1.65 }}>{result.pattern}</p>
        </div>
      </div>
      <div className="bar-list" style={{ marginTop: 22 }}>
        {result.pillarScores.map((pillar) => (
          <div className="bar-row" key={pillar.key}>
            <div className="bar-label">
              <span>{pillar.name}</span>
              <span>{pillar.score}/100</span>
            </div>
            <div className="pillar-score">
              <span style={{ width: `${pillar.score}%`, background: pillar.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
