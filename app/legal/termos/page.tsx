const sections = [
  {
    title: "Objeto",
    body:
      "O Virada IA e um assessor pessoal digital para organizar tarefas, agenda, lembretes, diagnosticos, relatorios e financas autorizadas. O servico pode usar IA para sugerir organizacao, prioridades e proximas acoes."
  },
  {
    title: "Limites",
    body:
      "O conteudo gerado nao substitui consultoria juridica, medica, psicologica, contabil, fiscal ou financeira profissional. Decisoes importantes devem ser conferidas pelo usuario antes de qualquer execucao externa."
  },
  {
    title: "Acoes externas",
    body:
      "O produto deve pedir confirmacao para acoes relevantes, como pagamentos, mensagens, eventos conectados, notificacoes e alteracoes sensiveis. Em caso de erro, nenhuma acao externa deve ser enviada automaticamente."
  },
  {
    title: "Open Finance",
    body:
      "Conexoes bancarias dependem de provedor contratado, consentimento especifico, escopo autorizado e disponibilidade das instituicoes. O usuario pode revogar conexoes e solicitar remocao de dados conforme a Politica de Privacidade."
  },
  {
    title: "Pagamentos",
    body:
      "Planos, reembolsos, cancelamentos e meios de pagamento seguem a oferta exibida no checkout e as regras do processador de pagamento. Beneficios pagos so devem ser liberados apos confirmacao valida do pagamento."
  },
  {
    title: "Uso aceitavel",
    body:
      "O usuario nao deve tentar acessar dados de terceiros, burlar seguranca, enviar conteudo ilegal, explorar falhas, automatizar abuso ou inserir dados bancarios fora dos fluxos oficiais."
  },
  {
    title: "Revisao",
    body:
      "Estes termos sao minuta operacional e precisam de revisao juridica antes de uso comercial amplo."
  }
];

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <div className="container panel" style={{ padding: 30 }}>
        <span className="eyebrow">Contrato de uso</span>
        <h1>Termos de Uso</h1>
        <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
          Ao usar o Virada IA, o usuario concorda com regras de uso, limites da IA, consentimentos e condicoes do
          servico.
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
