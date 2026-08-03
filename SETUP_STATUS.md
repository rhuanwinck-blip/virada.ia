# Setup Status

Atualizado em 2026-08-03.

| Area | Status | Observacao |
| --- | --- | --- |
| App producao | Ativo | `https://virada-ia.vercel.app` |
| GitHub | Atualizado | Repo `rhuanwinck-blip/virada.ia` em `main` |
| Vercel | Ativo | Deploy de producao pronto |
| Supabase | Ativo | Migrations principais aplicadas e service role revisado |
| OpenAI | Ativo | `OPENAI_API_KEY` configurada |
| Mercado Pago | Ativo | App Virada IA criado, checkout e webhook configurados |
| Pluggy backend | Ativo | Credenciais, webhook e secret configurados |
| Pluggy producao | Pendente externo | Solicitacao enviada; aguardando aprovacao da Pluggy |
| Pluggy dados reais | Pendente externo | Solicitacao enviada; aguardando aprovacao da Pluggy |
| Pluggy due diligence | Pendente externo | Botao ainda bloqueado no painel |
| Resend | Ativo basico | Readiness agora aceita `RESEND_DOMAIN_VERIFIED=true` quando o dominio estiver validado |
| Cron financeiro | Ativo | Protegido por `CRON_SECRET` |
| Criptografia financeira | Ativo | `FINANCIAL_DATA_ENCRYPTION_KEY` configurada |
| Observabilidade | Ativo basico | Vercel Analytics e Speed Insights injetados |
| LGPD/juridico | Pendente humano | Desbloqueia com `LEGAL_REVIEW_APPROVED_AT` e `LEGAL_REVIEW_APPROVER` apos revisao |
| Piloto banco real | Pendente externo | Roteiro em `docs/real-data-pilot.md`; desbloqueia com `REAL_DATA_PILOT_COMPLETED_AT` e relatorio |

Resumo: o tecnico essencial esta conectado. O lancamento oficial com banco real depende de aprovacao Pluggy, due diligence, revisao LGPD e piloto real controlado. As evidencias que levam o readiness a 100% estao em `docs/go-live-evidence.md`.
