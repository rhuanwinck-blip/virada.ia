# Piloto Com Banco Real

Use este roteiro somente depois que o provider Open Finance liberar producao e dados reais.

## Preparacao

- Escolher um usuario piloto que aceite participar do teste.
- Confirmar que o usuario sabe que vai conectar dados financeiros reais.
- Confirmar que o ambiente esta em `APP_ENV=production`, `DEMO_MODE=false` e `OPEN_FINANCE_SANDBOX=false`.
- Confirmar que `/api/readiness` mostra apenas bloqueios manuais esperados.
- Registrar hora de inicio, e-mail do usuario piloto e navegador usado.

## Fluxo Obrigatorio

1. Abrir `https://virada-ia.vercel.app/checkout`.
2. Fazer uma compra real controlada no Mercado Pago.
3. Confirmar retorno para login/onboarding.
4. Criar conta ou entrar com o mesmo e-mail da compra.
5. Verificar acesso ao dashboard.
6. Abrir a area de Financas.
7. Iniciar conexao bancaria pelo provider.
8. Confirmar que o app nao pede senha bancaria dentro do Virada IA.
9. Autorizar consentimento no fluxo oficial do provider.
10. Confirmar que a conexao aparece ativa.
11. Rodar sync manual ou aguardar webhook.
12. Confirmar importacao de contas, saldos e transacoes.
13. Categorizar pelo menos uma transacao.
14. Confirmar que dados sensiveis aparecem mascarados no agente.
15. Revogar a conexao.
16. Confirmar status revogado no dashboard.
17. Solicitar exportacao de dados.
18. Solicitar exclusao/remocao de dados financeiros.
19. Confirmar que dados removidos nao voltam em nova consulta.
20. Checar logs Vercel/Sentry/PostHog para erros.

## Criterios De Aprovacao

- Pagamento gera entitlement ativo para o e-mail correto.
- Login protege dashboard/onboarding.
- Conexao bancaria usa apenas o fluxo oficial do provider.
- Sync importa dados sem expor segredo, CPF completo, conta completa ou token.
- Categorizacao nao altera transacao sensivel sem confirmacao quando a confianca for baixa.
- Revogacao remove ou invalida a conexao.
- Exportacao e exclusao ficam registradas.
- Nenhum erro `5xx` novo aparece em producao durante o teste.

## Evidencias Para Guardar

- ID do pagamento Mercado Pago.
- E-mail do usuario piloto.
- Timestamp da conexao e da revogacao.
- Print ou log do status do provider.
- Resultado de `/api/readiness` antes e depois.
- Logs Vercel sem erro no periodo.
- Link do relatorio final.

Depois de aprovado, configurar:

```env
REAL_DATA_PILOT_COMPLETED_AT=YYYY-MM-DD
REAL_DATA_PILOT_REPORT_URL=https://link-do-relatorio
```
