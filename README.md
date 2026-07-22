# Virada IA

Assessor pessoal proativo com inteligencia artificial.

Promessa: **Fale o que precisa fazer. Seu assessor organiza o resto.**

## O Que Esta Implementado

- Landing page futurista azul/ciano com conversa, audio, agenda preenchendo, briefing, replanejamento, memoria, integracoes, planos, seguranca e FAQ.
- Dashboard reconstruido com as 15 areas pedidas: Central, Meu Dia, Assessor IA, Agenda, Tarefas, Projetos, Rotinas, Caixa de Entrada, Foco, Follow-ups, Memoria, Notificacoes, Integracoes, Assinatura e Configuracoes.
- Chat central por texto e audio demo, com classificacao em tarefa, compromisso, lembrete, rotina, projeto, follow-up ou nota.
- Confirmacao obrigatoria antes de criar ou preparar acoes importantes.
- Meu Dia visual com horario atual, agenda, tarefas prioritarias, tempo livre, conflitos, recomendacao da IA e progresso do dia.
- Onboarding pos-compra com ativacao do assessor, horarios, Google Calendar, notificacoes, WhatsApp, compromissos fixos, prioridades e primeiro dia.
- APIs demo/ready para organizar comandos, preparar Google Calendar, registrar push e preparar WhatsApp sem enviar nada externo sem consentimento.
- PWA com manifest e service worker.
- Nova migration Supabase para tasks, events, reminders, projects, project_tasks, inbox_items, follow_ups, user_memories, push_subscriptions, integrations, assistant_messages, daily_briefings e daily_reviews.
- Checkout, webhook de pagamento, seguranca e infraestrutura existente preservados.

## Rodar Localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Validacao

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:migrate
pnpm db:types
```

## Variaveis

Com `DEMO_MODE=true`, o app funciona sem credenciais reais.

Para producao, configure conforme o canal usado:

- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`

## Arquitetura Principal

- Landing: `components/AssessorLanding.tsx`
- Dashboard: `components/DashboardClient.tsx`
- Visuais: `components/AssessorVisuals.tsx`
- Nucleo do produto: `lib/assistant-core.ts`
- Onboarding: `components/OnboardingClient.tsx`
- Checkout: `app/checkout/page.tsx` e `app/api/checkout/route.ts`
- Pagamentos/webhook: `lib/payments.ts` e `app/api/payments/webhook/route.ts`
- APIs do assessor: `app/api/assistant/organize/route.ts`, `app/api/integrations/google-calendar/route.ts`, `app/api/integrations/whatsapp/route.ts`, `app/api/notifications/push/route.ts`
- Banco: `supabase/migrations/003_proactive_assessor_schema.sql`

## Documentacao

- `docs/proactive-assessor-redesign.md`
- `docs/redesign-audit.md`

## Limites De Seguranca

O Virada IA pode organizar, preparar, sugerir e replanejar. Enviar mensagem externa, criar evento em calendario conectado, acionar WhatsApp, alterar dados sensiveis ou executar acao importante exige consentimento e confirmacao do usuario.
