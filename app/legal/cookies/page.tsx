const sections = [
  {
    title: "Cookies essenciais",
    body:
      "Podem ser usados para sessao, seguranca, preferencias, PWA, antifraude e estabilidade. Sem eles, partes do app podem nao funcionar corretamente."
  },
  {
    title: "Mensuracao",
    body:
      "Ferramentas como PostHog podem medir paginas e eventos de produto sem receber dados financeiros brutos, CPF, senha, cartao completo ou respostas sensiveis."
  },
  {
    title: "Erro e performance",
    body:
      "Ferramentas como Sentry podem registrar falhas, rota, navegador e informacoes tecnicas suficientes para corrigir problemas de producao."
  },
  {
    title: "Controle",
    body:
      "O usuario pode limitar cookies pelo navegador. Quando exigido por lei ou estrategia de produto, cookies nao essenciais devem depender de consentimento separado."
  }
];

export default function CookiesPage() {
  return (
    <main className="legal-shell">
      <div className="container panel" style={{ padding: 30 }}>
        <span className="eyebrow">Preferencias</span>
        <h1>Politica de Cookies</h1>
        <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
          Esta politica explica categorias de cookies e tecnologias semelhantes usadas para manter o Virada IA seguro,
          estavel e mensuravel.
        </p>
        {sections.map((section) => (
          <section key={section.title} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: "1.15rem" }}>{section.title}</h2>
            <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
