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

Regra crítica: relatório e acesso completo só são liberados após webhook válido ou consulta segura no servidor.
