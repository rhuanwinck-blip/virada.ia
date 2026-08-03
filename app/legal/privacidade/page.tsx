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
    title: "Bases e consentimentos",
    body:
      "Tratamentos podem se apoiar em execucao do contrato, cumprimento legal, exercicio regular de direitos, legitimo interesse com minimizacao e consentimento quando exigido. Dados financeiros conectados, marketing e canais externos devem ter consentimento separado."
  },
  {
    title: "Open Finance",
    body:
      "O Virada IA nao solicita senha bancaria dentro do app. A conexao acontece no fluxo do provedor contratado, com consentimento especifico, prazo de validade, escopo de leitura e opcao de revogacao. O agente financeiro deve usar dados agregados, normalizados, mascarados e minimizados."
  },
  {
    title: "Direitos do titular",
    body:
      "O usuario pode solicitar confirmacao de tratamento, acesso, correcao, exportacao, exclusao, revogacao de consentimentos e informacoes sobre compartilhamento, observadas obrigacoes legais, auditoria e prevencao a fraude."
  },
  {
    title: "Retencao",
    body:
      "Dados de conta e uso sao mantidos enquanto necessarios para prestar o servico. Pagamentos, auditoria e seguranca podem exigir prazos maiores. Dados financeiros revogados ou excluidos seguem a politica de retencao aprovada para o produto."
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
    title: "Exportacao e exclusao",
    body:
      "O usuario pode solicitar exportacao, exclusao de conta e revogacao de consentimentos financeiros pelos canais oficiais do produto. Quando houver obrigacao de guardar registros, a exclusao pode virar bloqueio, anonimizacao ou retencao limitada."
  },
  {
    title: "Seguranca",
    body:
      "O app usa RLS, service role apenas no backend, webhooks autenticados, segredos fora do frontend, criptografia para dados financeiros sensiveis e mascaramento antes de enviar contexto para agentes."
  },
  {
    title: "Revisao juridica",
    body:
      "Esta politica e base operacional para producao controlada e deve ter aprovacao juridica registrada antes de campanha publica, trafego pago ou uso financeiro em escala."
  }
];

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <div className="container panel" style={{ padding: 30 }}>
        <span className="eyebrow">LGPD</span>
        <h1>Politica de Privacidade</h1>
        <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
          Este texto descreve como o Virada IA trata dados pessoais, consentimentos e informacoes financeiras
          autorizadas em producao controlada.
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
