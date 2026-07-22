# Virada IA

Sistema brasileiro de evolução pessoal orientado por inteligência artificial.

Promessa: **você não precisa mudar tudo. Precisa descobrir o que mudar primeiro.**

## O que está implementado

- Landing page premium com hero imersivo, narrativa de scroll, radar, scanner, fluxo de dados, demonstração e CTA final.
- Questionário inteligente com captura de contato, consentimento separado e leitura visual em tempo real.
- Motor determinístico de scoring, confiança, contradições, bloqueios e plano de 30 dias.
- Resultado gratuito reconstruído com mapa de pilares, evidências, limitações, prévia bloqueada e oferta transparente.
- Checkout em modo demonstração e wrapper preparado para Mercado Pago.
- Experiência de pagamento aprovado com overlay premium de desbloqueio.
- Dashboard completo com sidebar, command palette, navegação mobile, missão de hoje, plano, diagnóstico, pilares, padrões, prioridades, metas, rotina, hábitos, foco, finanças educacionais, check-ins, evolução, IA, recomendações, replanejamento, relatórios, conquistas, biblioteca, assinatura, configurações e ajuda.
- Painel admin redesenhado com módulos para funil, usuários, diagnósticos, conteúdo, perguntas, scoring, prompts, recomendações, preços, planos, feature flags, testes A/B, erros e auditoria.
- API routes para score, checkout, webhook, relatório PDF, health, exportação e exclusão.
- Supabase schema inicial e migration incremental para as novas áreas do produto, com RLS e índices.
- React Email/Resend, PostHog, Sentry, OpenAI, Mercado Pago e n8n preservados por contrato.
- Estados de loading/erro premium, reduced motion, testes unitários, Playwright e CI GitHub Actions.

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

Copie `.env.example` para `.env.local` e preencha apenas o que for usar. Com `DEMO_MODE=true`, o app funciona sem credenciais reais.

## Onde alterar

- Landing e storytelling: `components/PremiumLanding.tsx`
- Dashboard: `components/DashboardClient.tsx`
- Componentes visuais: `components/PremiumVisuals.tsx`
- Modelo de experiência: `lib/product-experience.ts`
- Preços e perguntas: `lib/questions.ts`
- Scoring: `lib/scoring.ts`
- Prompt/IA: `lib/ai-report.ts`
- Pagamentos: `lib/payments.ts` e `app/api/payments/webhook/route.ts`
- Analytics: `lib/events.ts`
- Banco: `supabase/migrations/001_initial_schema.sql` e `supabase/migrations/002_product_evolution_schema.sql`
- Admin: `components/AdminPanel.tsx`

## Documentação do redesign

- `docs/redesign-audit.md`
- `docs/extraordinary-redesign.md`

## Aviso importante

O Virada IA oferece uma análise educacional baseada nas informações fornecidas pelo usuário. Não realiza diagnóstico médico ou psicológico e não substitui profissionais de saúde, psicologia, finanças, contabilidade ou outras áreas especializadas.
