# Segurança

Implementado/preparado:

- validação server-side com Zod;
- CSP e headers de segurança;
- webhook de pagamento assinado fora do demo;
- webhook financeiro com assinatura, janela contra replay e idempotência;
- RLS no schema;
- logs de auditoria;
- ambiente demo separado;
- `.env` fora do Git.

Open Finance:

- segredos Pluggy/Belvo somente no backend;
- token temporário criado por rota server-side;
- nenhum token bancário persistido no navegador;
- nenhuma senha bancária solicitada pelo Virada IA;
- conexão inicial somente leitura;
- sem iniciação de pagamento;
- sem movimentação de dinheiro;
- revogação e remoção de dados preparadas;
- payload financeiro sanitizado antes de logs e agentes;
- agente financeiro usa dados agregados, normalizados, mascarados e minimizados.
- `/api/finance/sync` protegido por `CRON_SECRET`;
- `/api/readiness` bloqueia go-live sem secrets, Supabase real, Open Finance real, criptografia, cron e revisoes externas;
- persistencia financeira usa service role somente no backend;
- rotas financeiras exigem usuario autenticado quando `APP_ENV=production`, `DEMO_MODE=false` e `OPEN_FINANCE_SANDBOX=false`;
- CSP permite apenas providers e widgets oficiais necessarios para Open Finance.

Nunca expor chaves no frontend, liberar relatório por retorno do navegador, armazenar senha bancária, registrar token em texto simples ou enviar CPF/cartão completo para o modelo.
