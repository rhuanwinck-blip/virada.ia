# Relatório com IA

Implementação: `lib/ai-report.ts`.

Quando `OPENAI_API_KEY` existe e `DEMO_MODE=false`, a rota pode gerar uma resposta estruturada por schema JSON. Sem chave,
usa fallback determinístico.

Regras:

- não usar linguagem médica ou psicológica;
- não prometer resultado garantido;
- produzir análise educacional de hábitos;
- retornar resumo, prioridade, evidências, rotinas, retomada e educação financeira básica.
