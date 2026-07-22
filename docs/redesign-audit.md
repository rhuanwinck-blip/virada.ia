# Auditoria do Redesign Extraordinario

Data: 2026-07-21  
Branch: `feat/extraordinary-redesign`

## Estado encontrado

- App Router com rotas publicas para landing, diagnostico, resultado, checkout, dashboard, admin e paginas legais.
- Logica deterministica de scoring preservada em `lib/scoring.ts`.
- Questionario, contato e progresso local preservados em `lib/local-store.ts`.
- Pagamento em modo demo e contrato de webhook preservados em `lib/payments.ts` e `app/api/payments/webhook/route.ts`.
- Supabase preparado com tabelas iniciais para diagnosticos, leads, pagamentos, relatorios, acoes diarias e check-ins.
- OpenAI, Resend, PostHog, Sentry e Mercado Pago estao encapsulados para modo demo ou credenciais reais.
- Testes unitarios e fluxo e2e do diagnostico ja existem.

## Lacunas principais

- Landing ainda se apoia em grids de cards e mockup simples, sem narrativa forte de scroll.
- Dashboard era uma unica pagina com plano de 30 dias, sem arquitetura lateral, command palette, IA, metas, foco, rotina, financas, relatorios ou estados ricos.
- Experiencia de pagamento aprovado redirecionava direto para dashboard frio, sem desbloqueio premium.
- Admin ainda concentrava configuracoes basicas em uma tela simples.
- Banco nao cobria todas as novas superficies pedidas, como metas, habitos, foco, preferencias, recomendacoes, conversas de IA, biblioteca e notificacoes.
- Copy, microinteracoes e hierarquia visual ainda estavam proximas de template.
- Estados vazios, erro, carregamento e mobile precisavam de tratamento proprio.

## Decisoes de preservacao

- Nao alterar contratos publicos de API sem necessidade.
- Manter `scoreDiagnostic`, perguntas, webhook e checkout como fontes de verdade.
- Construir a nova experiencia sobre dados demo/local quando nao houver backend real.
- Marcar demonstracoes como exemplo quando os dados ainda forem simulados.
- Adicionar migrations seguras incrementais, sem destruir tabelas existentes.
