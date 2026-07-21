# Scoring

O score é determinístico:

1. Cada resposta de 1 a 5 vira uma pontuação de 0 a 100.
2. Perguntas invertidas são normalizadas.
3. Cada pilar recebe a média de suas perguntas.
4. O Índice de Virada é a média dos seis pilares.
5. O principal bloqueio é o pilar com menor score.
6. Confiança combina completude e número de contradições.

Implementação: `lib/scoring.ts`.
