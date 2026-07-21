# Arquitetura

```mermaid
flowchart LR
  Landing["Landing page"] --> Quiz["Diagnóstico"]
  Quiz --> Score["Scoring determinístico"]
  Score --> Free["Resultado gratuito"]
  Free --> Paywall["Oferta"]
  Paywall --> Checkout["Mercado Pago"]
  Checkout --> Webhook["Webhook seguro"]
  Webhook --> Report["Relatório + PDF"]
  Report --> Dashboard["Área do cliente"]
  Dashboard --> Checkin["Check-ins"]
  Admin["Admin"] --> Config["Preços, copy, perguntas, scoring"]
  Score --> Analytics["Eventos permitidos"]
  Webhook --> Audit["Logs de auditoria"]
```

O frontend usa Next.js App Router. A lógica crítica fica no backend ou em módulos compartilhados testáveis. Em modo demo,
persistência e pagamento são simulados para validar a jornada sem segredos.
