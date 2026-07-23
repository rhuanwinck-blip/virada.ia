# Analytics

Vercel Analytics e Speed Insights ficam ativos em `app/layout.tsx` para pageviews e Web Vitals de producao.

PostHog continua preparado em `lib/analytics-client.ts` para eventos de produto quando `NEXT_PUBLIC_POSTHOG_KEY` existir.

Sentry continua preparado em `instrumentation.ts`, `instrumentation-client.ts` e `next.config.mjs` quando `NEXT_PUBLIC_SENTRY_DSN` existir.

Eventos permitidos e propriedades ficam em `lib/events.ts`.

Nao enviar:

- e-mail;
- telefone;
- respostas completas;
- dados sensiveis;
- relatorio;
- pagamento;
- tokens.
