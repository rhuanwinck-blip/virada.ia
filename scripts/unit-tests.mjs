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

const pendingTests = [];

function test(name, fn) {
  pendingTests.push(
    Promise.resolve()
      .then(fn)
      .then(() => console.log(`✓ ${name}`))
      .catch((error) => {
        console.error(`✗ ${name}`);
        throw error;
      })
  );
}

const questionsModule = loadTs(path.join(root, "lib/questions.ts"));
const scoringModule = loadTs(path.join(root, "lib/scoring.ts"));
const securityModule = loadTs(path.join(root, "lib/security.ts"));
const assistantCoreModule = loadTs(path.join(root, "lib/assistant-core.ts"));
const financialProviderModule = loadTs(path.join(root, "lib/financial-provider.ts"));
const personalOsModule = loadTs(path.join(root, "lib/personal-os.ts"));

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
  assert.equal(
    securityModule.verifyReplayProtectedSignature({
      payload,
      signature,
      secret: "secret",
      timestamp: String(Math.floor(Date.now() / 1000))
    }),
    true
  );
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

  const financialQuery = assistantCoreModule.parseAssistantIntent("Quanto gastei com alimentacao neste mes?");
  assert.equal(financialQuery.type, "financial_query");
  assert.equal(financialQuery.needsConfirmation, true);

  const financialGoal = assistantCoreModule.parseAssistantIntent("Quero juntar R$ 20.000 para comprar um carro.");
  assert.equal(financialGoal.type, "financial_goal");
  assert.equal(financialGoal.missing.includes("valor-alvo"), false);

  const financialCommitment = assistantCoreModule.parseAssistantIntent("Preciso pagar o seguro ate sexta.");
  assert.equal(financialCommitment.type, "financial_commitment");
  assert.equal(financialCommitment.priority, "critica");
});

test("assistant day planning detects organization signals", () => {
  const score = assistantCoreModule.buildDayOrganizationScore(assistantCoreModule.demoTasks, assistantCoreModule.demoEvents);
  const briefing = assistantCoreModule.buildMorningBriefing();
  const windows = assistantCoreModule.findFreeWindows(assistantCoreModule.demoEvents);
  assert.ok(score >= 0 && score <= 100);
  assert.ok(briefing.greeting.includes("Bom dia"));
  assert.ok(Array.isArray(windows));
});

test("personal OS exposes exactly five connected main areas", () => {
  const ids = personalOsModule.personalOsAreas.map((area) => area.id);
  assert.deepEqual(ids, ["inicio", "jornada", "agenda", "financas", "agentes"]);
  assert.equal(personalOsModule.journeyTabs.length, 12);
  assert.equal(personalOsModule.agendaTabs.length, 10);
  assert.equal(personalOsModule.financeTabs.length, 15);

  const briefing = personalOsModule.buildPersonalOsBriefing();
  assert.ok(briefing.summary.includes("fatura"));
  assert.ok(briefing.nextCommitment);

  const classified = personalOsModule.classifyUniversalInboxInput("Pagar o seguro sexta.");
  assert.equal(classified.type, "compromisso_financeiro");
  assert.equal(classified.requiresConfirmation, true);
});

test("financial provider abstraction exposes required Open Finance methods", () => {
  const provider = new financialProviderModule.PluggyFinancialDataProvider();
  const methods = [
    "createConnectToken",
    "createConnection",
    "getConnectionStatus",
    "listInstitutions",
    "listAccounts",
    "listBalances",
    "listTransactions",
    "listCreditCards",
    "listBills",
    "listInvestments",
    "refreshConnection",
    "revokeConnection",
    "handleWebhook"
  ];
  assert.ok(methods.every((method) => typeof provider[method] === "function"));

  const belvo = new financialProviderModule.BelvoFinancialDataProvider();
  assert.equal(belvo.name, "belvo");
});

test("Pluggy sandbox returns masked read-only financial data", async () => {
  const provider = new financialProviderModule.PluggyFinancialDataProvider();
  const token = await provider.createConnectToken({ userId: "demo-user" });
  assert.equal(token.provider, "pluggy");
  assert.equal(token.sandbox, true);
  assert.ok(token.connectToken.includes("sandbox"));

  const accounts = await provider.listAccounts();
  const transactions = await provider.listTransactions();
  const cards = await provider.listCreditCards();
  const bills = await provider.listBills();
  const investments = await provider.listInvestments();

  assert.ok(accounts.every((account) => account.numberMask.startsWith("****")));
  assert.ok(transactions.every((transaction) => transaction.rawPreserved));
  assert.ok(cards.every((card) => card.finalDigits.length === 4));
  assert.ok(bills.length > 0);
  assert.ok(investments.every((investment) => investment.sandbox));
});

test("financial categorization preserves raw fields and asks confirmation on low confidence", () => {
  const market = financialProviderModule.categorizeTransaction({
    description: "MERCADO SOL NASCENTE",
    amount: -286.74
  });
  assert.equal(market.category, "mercado");
  assert.equal(market.requiresConfirmation, false);

  const unknown = financialProviderModule.categorizeTransaction({
    description: "PAGAMENTO XYZ DESCONHECIDO",
    amount: -42
  });
  assert.equal(unknown.category, "outros_gastos");
  assert.equal(unknown.requiresConfirmation, true);
});

test("financial overview, subscriptions and AI sanitization are safe", () => {
  const overview = financialProviderModule.buildFinancialOverview();
  assert.equal(overview.sandbox, true);
  assert.ok(overview.consolidatedBalance.amount > 0);
  assert.ok(overview.subscriptions.length >= 1);

  const sanitized = financialProviderModule.sanitizeForFinancialAgent({
    overview,
    accounts: financialProviderModule.sandboxAccounts,
    transactions: financialProviderModule.sandboxTransactions
  });
  assert.ok(sanitized.sensitiveFieldsRemoved.includes("cpf"));
  assert.ok(sanitized.accounts.every((account) => account.numberMask.startsWith("****")));
  assert.equal(JSON.stringify(sanitized).includes("originalDescription"), false);
});

await Promise.all(pendingTests);
