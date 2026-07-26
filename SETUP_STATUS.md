# Setup Status

Atualizado em 2026-07-26.

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
| Resend | Ativo basico | Recomenda-se dominio verificado antes de divulgacao ampla |
| Cron financeiro | Ativo | Protegido por `CRON_SECRET` |
| Criptografia financeira | Ativo | `FINANCIAL_DATA_ENCRYPTION_KEY` configurada |
| Observabilidade | Ativo basico | Vercel Analytics e Speed Insights injetados |
| LGPD/juridico | Pendente humano | Termos, privacidade, consentimento e retencao precisam de revisao |
| Piloto banco real | Pendente externo | Depende da liberacao Pluggy para dados reais |

Resumo: o tecnico essencial esta conectado. O lancamento oficial com banco real depende de aprovacao Pluggy, due diligence, revisao LGPD e piloto real controlado.
