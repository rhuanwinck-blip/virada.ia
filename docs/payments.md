# Pagamentos

Implementação base: `lib/payments.ts` e `app/api/payments/webhook/route.ts`.

Estados aceitos:

- `pending`
- `approved`
- `in_process`
- `rejected`
- `cancelled`
- `refunded`
- `charged_back`

Regra critica: relatorio e acesso completo so sao liberados apos webhook valido ou consulta segura no servidor.

Persistencia de acesso:

- `/api/payments/webhook` valida assinatura Mercado Pago em producao;
- consulta o pagamento no servidor;
- grava/atualiza `payments`;
- grava/atualiza `user_entitlements`;
- envia email transacional quando existe email do pagador;
- registra auditoria em `audit_logs`.

Migration necessaria para esse fluxo: `006_payment_entitlements.sql`.
