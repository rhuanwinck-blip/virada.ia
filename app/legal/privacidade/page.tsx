const sections = [
  {
    title: "Dados tratados",
    body:
      "Tratamos dados de cadastro, contato, respostas do diagnostico, preferencias, eventos minimos de uso, pagamentos, consentimentos e registros tecnicos de seguranca. Dados financeiros so entram por conexao autorizada pelo usuario via provedor oficial de Open Finance."
  },
  {
    title: "Finalidades",
    body:
      "Usamos os dados para operar o assessor pessoal, organizar agenda, tarefas e financas, gerar lembretes, processar pagamentos, manter seguranca, cumprir obrigacoes legais, prestar suporte e melhorar o produto com metricas minimizadas."
  },
  {
    title: "Open Finance",
    body:
      "O Virada IA nao solicita senha bancaria dentro do app. A conexao acontece no fluxo do provedor contratado, com consentimento especifico, prazo de validade, escopo de leitura e opcao de revogacao. O agente financeiro deve usar dados agregados, normalizados, mascarados e minimizados."
  },
  {
    title: "Analytics e observabilidade",
    body:
      "Eventos de produto nao devem receber CPF, senha, cartao completo, extrato bruto ou respostas sensiveis. Logs de erro podem conter contexto tecnico necessario para diagnostico, com mascaramento e acesso restrito."
  },
  {
    title: "Compartilhamento",
    body:
      "Podemos usar operadores como Vercel, Supabase, OpenAI, Mercado Pago, Resend, Pluggy ou Belvo, Sentry e PostHog, sempre conforme a finalidade do servico. Nao vendemos dados pessoais."
  },
  {
    title: "Retencao, exportacao e exclusao",
    body:
      "Dados sao mantidos enquanto a conta estiver ativa, pelo prazo necessario a seguranca, suporte, auditoria e obrigacoes legais. O usuario pode solicitar exportacao, exclusao de conta e revogacao de consentimentos financeiros pelos canais oficiais do produto."
  },
  {
    title: "Revisao juridica",
    body:
      "Esta politica e uma minuta operacional para go-live tecnico e deve ser validada por responsavel juridico antes de campanha publica, trafego pago ou uso financeiro em escala."
  }
];

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <div className="container panel" style={{ padding: 30 }}>
        <span className="eyebrow">LGPD</span>
        <h1>Politica de Privacidade</h1>
        <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
          Versao operacional para producao controlada. Este texto descreve como o Virada IA trata dados pessoais,
          consentimentos e informacoes financeiras autorizadas.
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
