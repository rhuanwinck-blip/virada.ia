# Auditoria Virada IA - Personal OS + Open Finance

Data: 2026-07-22
Branch alvo: `feat/personal-os-open-finance-redesign`

## Stack atual

- Next.js App Router com React 19, TypeScript e CSS global.
- Framer Motion para animacoes e lucide-react para iconografia.
- Supabase preparado por migrations SQL com RLS.
- Mercado Pago isolado em `lib/payments.ts`, `/api/checkout` e `/api/payments/webhook`.
- OpenAI isolado em `/api/assistant/organize`, com parser demo quando nao ha credencial.
- PWA preparado por `public/manifest.webmanifest`, `public/sw.js` e `/api/notifications/push`.
- Testes locais por `scripts/unit-tests.mjs`, Playwright via `scripts/e2e-runner.mjs`, lint/typecheck/build por pnpm.

## Rotas revisadas

- `/` usa `components/AssessorLanding.tsx`.
- `/dashboard` usa `components/DashboardClient.tsx`.
- `/onboarding` usa `components/OnboardingClient.tsx`.
- `/checkout` e `/api/checkout` preservam o contrato de pagamento demo/Mercado Pago.
- `/api/payments/webhook` valida assinatura quando demo esta desligado.
- `/api/assistant/organize` transforma linguagem natural em rascunho confirmado.
- `/api/integrations/google-calendar`, `/api/integrations/whatsapp` e `/api/notifications/push` preservam contratos de integracao.
- `/api/export` e `/api/delete-account` preservam contratos LGPD existentes.

## Banco e seguranca

- `001_initial_schema.sql` cobre diagnostico, leads, pagamentos, relatorios e auditoria admin.
- `002_product_evolution_schema.sql` cobre goals, routines, habits, notificacoes, preferencias, widgets e historico.
- `003_proactive_assessor_schema.sql` cobre tasks, events, reminders, projects, inbox, follow-ups, memoria, push, integracoes, mensagens e briefings.
- RLS ja existe nas tabelas principais de usuario.
- Gaps encontrados: nao havia tabelas dedicadas para Open Finance, consentimentos, extrato bruto, categorizacao, cartoes, faturas, investimentos, sync jobs, webhooks financeiros ou feature flags.

## Funcionalidades funcionando

- Landing, dashboard demo, onboarding, checkout demo, API do assessor, PWA/push em contrato, Google Calendar/WhatsApp em contrato, pagamentos e migrations existentes.
- Acoes internas como criar rascunho, confirmar tarefa/agenda, alternar tarefas, pausar rotinas, foco e apagar memorias funcionam no cliente.

## Problemas encontrados

- A navegacao do dashboard era ampla, mas nao seguia as cinco areas obrigatorias do novo produto.
- A landing prometia assessor, nao um sistema operacional pessoal completo.
- Nao havia modulo financeiro completo nem provider Open Finance.
- Nao havia fluxo de conexao bancaria, revogacao, extrato unificado, categorizacao, assinaturas, cartoes, faturas ou investimentos.
- Alguns dados demo nao estavam claramente separados de um modo Open Finance sandbox.
- O onboarding nao incluia bancos via Open Finance, contas manuais, primeira meta financeira e briefing com financas.
- Variaveis de ambiente de Open Finance, Belvo, Pluggy e web push aliases ainda nao existiam no `.env.example`.

## Decisoes de preservacao

- Nao alterar contratos de pagamento existentes.
- Nao remover migrations antigas nem dados existentes.
- Manter APIs sensiveis no backend.
- Open Finance sera somente leitura, sem scraping, sem senha bancaria, sem token bancario no navegador e sem iniciacao de pagamento.
- Enquanto faltarem credenciais reais, o provider opera em sandbox claramente identificado.
