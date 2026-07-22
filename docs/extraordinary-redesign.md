# Redesign Extraordinario do Virada IA

## Objetivo

Transformar o Virada IA de uma landing com questionario e dashboard simples em uma experiencia de produto premium:

- sistema inteligente de direcao pessoal;
- diagnostico explicavel;
- plano de 30 dias;
- dashboard com navegacao lateral;
- assistente IA contextual;
- areas de evolucao, metas, rotina, habitos, foco, financas, check-ins, relatorios e conta;
- motion system com scanner, radar, nucleo de progresso, timeline e desbloqueio.

## O que foi preservado

- Contrato do scoring deterministico em `lib/scoring.ts`.
- Questionario e fluxo gratuito.
- Checkout POST em `/api/checkout`.
- Webhook de pagamentos em `/api/payments/webhook`.
- Geracao de PDF em `/api/report`.
- Modo demo quando credenciais reais nao existem.
- Integrações preparadas para Supabase, Mercado Pago, OpenAI, Resend, Sentry e PostHog.

## Principais novas superficies

- Landing page imersiva em `components/PremiumLanding.tsx`.
- Componentes visuais premium em `components/PremiumVisuals.tsx`.
- Dashboard completo em `components/DashboardClient.tsx`.
- Resultado gratuito reconstruido em `components/ResultClient.tsx`.
- Checkout premium em `app/checkout/page.tsx`.
- Admin redesenhado em `components/AdminPanel.tsx`.
- Modelo de experiencia em `lib/product-experience.ts`.
- Estados de carregamento e erro em `app/loading.tsx`, `app/error.tsx`, `app/dashboard/loading.tsx` e `app/dashboard/error.tsx`.

## Areas do dashboard

O dashboard possui 26 secoes funcionais, agrupadas em:

- Agora;
- Entender;
- Evoluir;
- Inteligencia;
- Conta.

Quando um recurso ainda depende de backend real, a tela entrega uma versao demo funcional, marcada como exemplo, sem exibir aba vazia.

## Banco

A migration `002_product_evolution_schema.sql` adiciona tabelas para:

- metas;
- rotina e blocos de rotina;
- habitos e registros;
- foco;
- financas educacionais;
- prioridades;
- recomendacoes;
- conversas e mensagens de IA;
- versoes do plano;
- conquistas;
- biblioteca;
- notificacoes;
- preferencias;
- widgets do dashboard.

Todas as novas tabelas possuem RLS, indices e ownership por usuario quando aplicavel.

## Motion e acessibilidade

- Framer Motion usado para scanner, radar, timeline, command palette, overlay de desbloqueio e microinteracoes.
- `prefers-reduced-motion` respeitado globalmente.
- A pagina nao depende de opacidade zero para esconder secoes inteiras.
- Mobile usa navegacao inferior e areas de toque grandes.

## Validacao

Executar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Tambem foi criado um script visual temporario em `work/visual-redesign-check.mjs` para gerar screenshots de landing e dashboard em desktop/mobile.
