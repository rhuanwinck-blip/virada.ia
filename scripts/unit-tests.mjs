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
const productExperienceModule = loadTs(path.join(root, "lib/product-experience.ts"));

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

test("dashboard navigation has no empty or duplicate sections", () => {
  const ids = productExperienceModule.dashboardNavigation.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(productExperienceModule.dashboardNavigation.length >= 26);
  assert.ok(productExperienceModule.dashboardNavigation.every((item) => item.label && item.description && item.group));
});

test("weekly plan covers all 30 missions", () => {
  const result = scoringModule.scoreDiagnostic(questionsModule.demoAnswers);
  const weeks = productExperienceModule.buildWeeklyPlan(result);
  const missionCount = weeks.reduce((sum, week) => sum + week.missions.length, 0);
  assert.equal(weeks.length, 4);
  assert.equal(missionCount, 30);
});
