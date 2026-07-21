# Virada IA

Plataforma brasileira de análise educacional de hábitos, rotina, direção pessoal e progresso.

Promessa: **você não precisa mudar tudo. Precisa descobrir o que mudar primeiro.**

## O que está implementado

- Landing page responsiva com hero, dores, prova de método, pricing, FAQ e CTA mobile fixo.
- Questionário inteligente com captura de contato e consentimento separado.
- Motor determinístico de scoring, confiança, contradições e plano de 30 dias.
- Resultado gratuito com paywall e prévia do plano completo.
- Checkout em modo demonstração e wrapper preparado para Mercado Pago.
- Dashboard do cliente com missões diárias e progresso local.
- Painel admin demo para preços, copy, perguntas, funil e auditoria.
- API routes para score, checkout, webhook, relatório PDF, health, exportação e exclusão.
- Supabase schema inicial com RLS, logs de auditoria, consentimentos e relatórios.
- React Email/Resend, PostHog, Sentry, OpenAI e n8n preparados por contrato.
- Testes unitários, Playwright, CI GitHub Actions e documentação.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Validação

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm validate
```

## Variáveis

Copie `.env.example` para `.env.local` e preencha apenas o que for usar. Com `DEMO_MODE=true`, o app funciona sem
credenciais reais.

## Onde alterar

- Copy principal: `lib/admin-config.ts` e `app/page.tsx`
- Preços: `lib/questions.ts` e painel `/admin`
- Perguntas: `lib/questions.ts`
- Scoring: `lib/scoring.ts`
- Prompt/IA: `lib/ai-report.ts`
- Pagamentos: `lib/payments.ts` e `app/api/payments/webhook/route.ts`
- Analytics: `lib/events.ts`
- Banco: `supabase/migrations/001_initial_schema.sql`

## Aviso importante

O Virada IA oferece uma análise educacional baseada nas informações fornecidas pelo usuário. Não realiza diagnóstico
médico ou psicológico e não substitui profissionais de saúde, psicologia, finanças, contabilidade ou outras áreas
especializadas.
