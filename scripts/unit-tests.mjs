import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = process.cwd();
const cache = new Map();

function resolveTs(id, parentFile) {
  if (id.startsWith("@/")) return path.join(root, `${id.slice(2)}.ts`);
  if (id.startsWith(".")) return path.resolve(path.dirname(parentFile), `${id}.ts`);
  return null;
}

function loadTs(file) {
  const normalized = path.normalize(file);
  if (cache.has(normalized)) return cache.get(normalized).exports;

  const source = readFileSync(normalized, "utf8");
  const localModule = { exports: {} };
  cache.set(normalized, localModule);

  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true
    }
  });

  const nativeRequire = createRequire(normalized);
  const localRequire = (id) => {
    const resolved = resolveTs(id, normalized);
    return resolved ? loadTs(resolved) : nativeRequire(id);
  };

  const fn = new Function("exports", "require", "module", "__filename", "__dirname", outputText);
  fn(localModule.exports, localRequire, localModule, normalized, path.dirname(normalized));
  return localModule.exports;
}

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

const questionsModule = loadTs(path.join(root, "lib/questions.ts"));
const scoringModule = loadTs(path.join(root, "lib/scoring.ts"));
const securityModule = loadTs(path.join(root, "lib/security.ts"));
const assistantCoreModule = loadTs(path.join(root, "lib/assistant-core.ts"));

test("scoreDiagnostic is deterministic", () => {
  const first = scoringModule.scoreDiagnostic(questionsModule.demoAnswers);
  const second = scoringModule.scoreDiagnostic(questionsModule.demoAnswers);
  assert.deepEqual(first, second);
  assert.equal(first.pillarScores.length, 6);
  assert.equal(first.thirtyDayPlan.length, 30);
  assert.ok(first.viradaIndex >= 0 && first.viradaIndex <= 100);
});

test("all question answers normalize into valid pillars", () => {
  const allFive = Object.fromEntries(questionsModule.questions.map((question) => [question.key, 5]));
  const result = scoringModule.scoreDiagnostic(allFive);
  assert.equal(result.topBlockers.length, 3);
  assert.ok(result.pillarScores.every((pillar) => pillar.score >= 0 && pillar.score <= 100));
});

test("contradictions are detected", () => {
  const contradictions = scoringModule.detectContradictions({
    priority_defined: 5,
    too_many_goals: 5,
    keeps_small_commitments: 5,
    abandons_plans: 5
  });
  assert.ok(contradictions.some((item) => item.key === "direction-overload"));
  assert.ok(contradictions.some((item) => item.key === "commitment-abandon"));
});

test("webhook signatures validate safely", () => {
  const payload = JSON.stringify({ id: "pay_1", status: "approved" });
  const signature = securityModule.signPayload(payload, "secret");
  assert.equal(securityModule.verifyWebhookSignature(payload, signature, "secret"), true);
  assert.equal(securityModule.verifyWebhookSignature(payload, "bad", "secret"), false);
});

test("assistant navigation matches the proactive product map", () => {
  const ids = assistantCoreModule.assistantNavigation.map((item) => item.id);
  const labels = assistantCoreModule.assistantNavigation.map((item) => item.label);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(assistantCoreModule.assistantNavigation.length, 15);
  assert.deepEqual(labels, [
    "Central",
    "Meu Dia",
    "Assessor IA",
    "Agenda",
    "Tarefas",
    "Projetos",
    "Rotinas",
    "Caixa de Entrada",
    "Foco",
    "Follow-ups",
    "Memoria",
    "Notificacoes",
    "Integracoes",
    "Assinatura",
    "Configuracoes"
  ]);
  assert.ok(assistantCoreModule.assistantNavigation.every((item) => item.label && item.description && item.group));
});

test("assistant parser turns natural Portuguese into safe draft actions", () => {
  const event = assistantCoreModule.parseAssistantIntent("Amanha as 14h tenho dentista.");
  assert.equal(event.type, "event");
  assert.equal(event.dateLabel, "Amanha");
  assert.equal(event.timeLabel, "14:00");
  assert.equal(event.needsConfirmation, true);

  const reminder = assistantCoreModule.parseAssistantIntent("Me lembra de ligar para o Joao sexta.");
  assert.equal(reminder.type, "reminder");
  assert.equal(reminder.dateLabel, "Sexta");
  assert.ok(reminder.missing.includes("horario"));

  const routine = assistantCoreModule.parseAssistantIntent("Toda segunda preciso conferir as vendas.");
  assert.equal(routine.type, "routine");
  assert.equal(routine.dateLabel, "Segunda");
});

test("assistant day planning detects organization signals", () => {
  const score = assistantCoreModule.buildDayOrganizationScore(assistantCoreModule.demoTasks, assistantCoreModule.demoEvents);
  const briefing = assistantCoreModule.buildMorningBriefing();
  const windows = assistantCoreModule.findFreeWindows(assistantCoreModule.demoEvents);
  assert.ok(score >= 0 && score <= 100);
  assert.ok(briefing.greeting.includes("Bom dia"));
  assert.ok(Array.isArray(windows));
});
