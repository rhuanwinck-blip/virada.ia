# Reconstrucao: Virada IA como assessor pessoal proativo

## Auditoria

A versao anterior centralizava diagnostico, pilares, habitos, relatorios e plano de 30 dias. A infraestrutura util estava separada em API routes e libs de pagamento, seguranca, Supabase, e-mail, analytics e scoring legado.

Decisao de preservacao:

- Preservado: checkout, webhook, seguranca, scripts de validacao, Supabase, rotas legais, estrutura Next.js e modo demo.
- Substituido: landing, dashboard, narrativa de produto, navegacao, identidade visual, pos-compra e admin operacional.
- Mantido como legado compatível: diagnostico/resultado continuam compilando, mas deixam de ser o produto principal.

## Novo Produto

Promessa:

> Fale o que precisa fazer. Seu assessor organiza o resto.

O novo Virada IA atua como chefe de gabinete pessoal. O usuario escreve ou grava uma entrada natural e o sistema transforma em rascunho seguro antes de criar:

- compromisso;
- tarefa;
- lembrete;
- rotina;
- projeto;
- follow-up;
- nota;
- item de caixa de entrada.

## Superficies

- Landing futurista azul/ciano, com celular, audio, agenda, briefing, replanejamento, memoria, integracoes, planos, seguranca e FAQ.
- Dashboard com 15 areas funcionais, sem abas vazias.
- Onboarding pos-compra com ativacao do assessor e configuracao inicial.
- Admin para operacao de agenda, tarefas, IA, notificacoes, consentimentos, integracoes e auditoria.

## Contratos De IA E Integracoes

As APIs novas operam em modo demo/ready:

- `/api/assistant/organize`: classifica linguagem natural e retorna draft.
- `/api/integrations/google-calendar`: prepara evento e exige confirmacao.
- `/api/integrations/whatsapp`: prepara mensagem e exige confirmacao.
- `/api/notifications/push`: valida assinatura push com consentimento.

Nenhuma rota envia mensagem externa, cria evento conectado ou dispara notificacao real sem consentimento.

## Banco

A migration `003_proactive_assessor_schema.sql` cria ou adapta entidades para:

- tasks;
- events;
- reminders;
- routines;
- projects;
- project_tasks;
- inbox_items;
- follow_ups;
- user_memories;
- notifications;
- push_subscriptions;
- integrations;
- assistant_messages;
- daily_briefings;
- daily_reviews.

Todas as novas tabelas sensiveis recebem RLS por `auth.uid() = user_id`.

## Validacao Esperada

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:migrate
pnpm db:types
```
