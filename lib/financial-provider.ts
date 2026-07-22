export type FinancialProviderName = "pluggy" | "belvo";

export type FinancialConnectionStatus =
  | "conectando"
  | "aguardando_consentimento"
  | "conectada"
  | "sincronizando"
  | "atencao_necessaria"
  | "consentimento_expirando"
  | "consentimento_expirado"
  | "revogada"
  | "erro_temporario";

export type FinancialProduct =
  | "accounts"
  | "balances"
  | "transactions"
  | "credit_cards"
  | "bills"
  | "investments";

export type Money = {
  amount: number;
  currency: "BRL";
};

export type FinancialInstitution = {
  id: string;
  provider: FinancialProviderName;
  name: string;
  brandName: string;
  country: "BR";
  products: FinancialProduct[];
  sandbox: boolean;
};

export type FinancialConnection = {
  id: string;
  userId: string;
  provider: FinancialProviderName;
  providerItemId: string;
  institutionId: string;
  institutionName: string;
  status: FinancialConnectionStatus;
  consentStatus: "active" | "expiring" | "expired" | "revoked" | "pending";
  consentExpiresAt: string;
  lastSyncAt: string;
  nextSyncAt: string;
  products: FinancialProduct[];
  accountName: string;
  accountType: "checking" | "savings" | "credit_card" | "investment";
  accountMask: string;
  holderMask: string;
  errorCode?: string;
  errorMessage?: string;
  sandbox: boolean;
};

export type FinancialAccount = {
  id: string;
  connectionId: string;
  institutionName: string;
  name: string;
  type: "checking" | "savings" | "payment" | "investment";
  numberMask: string;
  holderMask: string;
  balance: Money;
  updatedAt: string;
  sandbox: boolean;
};

export type FinancialBalance = {
  accountId: string;
  available: Money;
  current: Money;
  blocked?: Money;
  updatedAt: string;
  sandbox: boolean;
};

export type FinancialCategory =
  | "alimentacao"
  | "mercado"
  | "transporte"
  | "moradia"
  | "saude"
  | "educacao"
  | "lazer"
  | "viagens"
  | "compras"
  | "servicos"
  | "assinaturas"
  | "impostos"
  | "transferencias"
  | "investimentos"
  | "salario"
  | "vendas"
  | "outras_entradas"
  | "outros_gastos";

export type FinancialTransaction = {
  id: string;
  connectionId: string;
  accountId: string;
  institutionName: string;
  originalDescription: string;
  normalizedDescription: string;
  amount: Money;
  date: string;
  category: FinancialCategory;
  type: "entrada" | "saida";
  status: "posted" | "pending";
  recurring: boolean;
  confidence: number;
  note?: string;
  source: FinancialProviderName | "manual";
  externalId: string;
  syncedAt: string;
  rawPreserved: boolean;
  hiddenFromAnalysis?: boolean;
  sandbox: boolean;
};

export type CreditCard = {
  id: string;
  connectionId: string;
  institutionName: string;
  name: string;
  finalDigits: string;
  limit: Money;
  availableLimit: Money;
  currentBill: Money;
  closingDay: number;
  dueDay: number;
  utilization: number;
  sandbox: boolean;
};

export type CreditCardBill = {
  id: string;
  cardId: string;
  dueDate: string;
  closingDate: string;
  amount: Money;
  status: "open" | "closed" | "paid" | "overdue";
  projectedAmount: Money;
  confidence: number;
  sandbox: boolean;
};

export type FinancialInvestment = {
  id: string;
  connectionId: string;
  institutionName: string;
  type: "renda_fixa" | "tesouro" | "fundo" | "acao" | "cripto" | "manual";
  product: string;
  balance: Money;
  investedAmount: Money;
  updatedAt: string;
  sandbox: boolean;
};

export type FinancialSubscription = {
  id: string;
  service: string;
  amount: Money;
  frequency: "mensal" | "anual" | "semanal";
  nextChargeDate: string;
  accountOrCard: string;
  status: "provavel" | "confirmada" | "em_revisao";
  confidence: number;
  sandbox: boolean;
};

export type FinancialOverview = {
  consolidatedBalance: Money;
  incomeThisMonth: Money;
  outcomeThisMonth: Money;
  savingsThisMonth: Money;
  cashflowForecast: Money;
  connectedInstitutions: number;
  lastSyncAt: string;
  nextBill?: CreditCardBill;
  subscriptions: FinancialSubscription[];
  categoryDistribution: { category: FinancialCategory; amount: Money; percent: number }[];
  alerts: string[];
  sandbox: boolean;
};

export type ConnectTokenInput = {
  userId: string;
  webhookUrl?: string;
  redirectUrl?: string;
  connectionId?: string;
};

export type ConnectTokenResult = {
  provider: FinancialProviderName;
  connectToken: string;
  expiresAt: string;
  mode: "sandbox" | "production";
  clientUserId: string;
  widgetUrl?: string;
  requiresOfficialWidget: boolean;
  sandbox: boolean;
};

export type CreateConnectionInput = {
  userId: string;
  providerItemId?: string;
  institutionId?: string;
  connectToken?: string;
};

export type FinancialWebhookEvent = {
  provider: FinancialProviderName;
  eventId: string;
  event: string;
  providerItemId?: string;
  connectionId?: string;
  status: "accepted" | "duplicate" | "ignored";
  shouldSync: boolean;
  idempotencyKey: string;
  receivedAt: string;
  sanitizedRaw: Record<string, unknown>;
};

export interface FinancialDataProvider {
  readonly name: FinancialProviderName;
  createConnectToken(input: ConnectTokenInput): Promise<ConnectTokenResult>;
  createConnection(input: CreateConnectionInput): Promise<FinancialConnection>;
  getConnectionStatus(connectionId: string): Promise<FinancialConnectionStatus>;
  listInstitutions(): Promise<FinancialInstitution[]>;
  listAccounts(connectionId?: string): Promise<FinancialAccount[]>;
  listBalances(connectionId?: string): Promise<FinancialBalance[]>;
  listTransactions(filters?: { connectionId?: string; from?: string; to?: string; category?: FinancialCategory }): Promise<FinancialTransaction[]>;
  listCreditCards(connectionId?: string): Promise<CreditCard[]>;
  listBills(connectionId?: string): Promise<CreditCardBill[]>;
  listInvestments(connectionId?: string): Promise<FinancialInvestment[]>;
  refreshConnection(connectionId: string): Promise<{ status: FinancialConnectionStatus; syncJobId: string; message: string }>;
  revokeConnection(connectionId: string): Promise<{ status: FinancialConnectionStatus; revokedAt: string; message: string }>;
  handleWebhook(payload: Record<string, unknown>): Promise<FinancialWebhookEvent>;
}

const now = "2026-07-22T12:00:00.000Z";

const sandboxInstitutions: FinancialInstitution[] = [
  {
    id: "pluggy-sandbox-001",
    provider: "pluggy",
    name: "Banco Aurora Sandbox",
    brandName: "Aurora",
    country: "BR",
    products: ["accounts", "balances", "transactions", "credit_cards", "bills"],
    sandbox: true
  },
  {
    id: "pluggy-sandbox-002",
    provider: "pluggy",
    name: "Conta Nexus Sandbox",
    brandName: "Nexus",
    country: "BR",
    products: ["accounts", "balances", "transactions", "investments"],
    sandbox: true
  },
  {
    id: "pluggy-sandbox-003",
    provider: "pluggy",
    name: "Investimentos Prisma Sandbox",
    brandName: "Prisma",
    country: "BR",
    products: ["accounts", "balances", "investments"],
    sandbox: true
  }
];

export const sandboxFinancialConnections: FinancialConnection[] = [
  {
    id: "fin-conn-aurora",
    userId: "demo-user",
    provider: "pluggy",
    providerItemId: "pluggy-item-sandbox-aurora",
    institutionId: "pluggy-sandbox-001",
    institutionName: "Banco Aurora Sandbox",
    status: "conectada",
    consentStatus: "active",
    consentExpiresAt: "2026-10-20T23:59:59.000Z",
    lastSyncAt: "2026-07-22T09:10:00.000Z",
    nextSyncAt: "2026-07-22T21:10:00.000Z",
    products: ["accounts", "balances", "transactions", "credit_cards", "bills"],
    accountName: "Conta principal",
    accountType: "checking",
    accountMask: "**** 4821",
    holderMask: "R*** W*****",
    sandbox: true
  },
  {
    id: "fin-conn-nexus",
    userId: "demo-user",
    provider: "pluggy",
    providerItemId: "pluggy-item-sandbox-nexus",
    institutionId: "pluggy-sandbox-002",
    institutionName: "Conta Nexus Sandbox",
    status: "sincronizando",
    consentStatus: "active",
    consentExpiresAt: "2026-09-04T23:59:59.000Z",
    lastSyncAt: "2026-07-22T08:40:00.000Z",
    nextSyncAt: "2026-07-22T20:40:00.000Z",
    products: ["accounts", "balances", "transactions", "investments"],
    accountName: "Reserva",
    accountType: "savings",
    accountMask: "**** 0934",
    holderMask: "R*** W*****",
    sandbox: true
  }
];

export const sandboxAccounts: FinancialAccount[] = [
  {
    id: "acc-aurora-checking",
    connectionId: "fin-conn-aurora",
    institutionName: "Banco Aurora Sandbox",
    name: "Conta corrente",
    type: "checking",
    numberMask: "**** 4821",
    holderMask: "R*** W*****",
    balance: brl(8420.76),
    updatedAt: "2026-07-22T09:10:00.000Z",
    sandbox: true
  },
  {
    id: "acc-nexus-savings",
    connectionId: "fin-conn-nexus",
    institutionName: "Conta Nexus Sandbox",
    name: "Reserva de oportunidade",
    type: "savings",
    numberMask: "**** 0934",
    holderMask: "R*** W*****",
    balance: brl(15320.15),
    updatedAt: "2026-07-22T08:40:00.000Z",
    sandbox: true
  }
];

export const sandboxBalances: FinancialBalance[] = sandboxAccounts.map((account) => ({
  accountId: account.id,
  available: account.balance,
  current: brl(account.balance.amount + (account.type === "checking" ? 180.42 : 0)),
  updatedAt: account.updatedAt,
  sandbox: true
}));

export const sandboxTransactions: FinancialTransaction[] = [
  tx("txn-001", "acc-aurora-checking", "Banco Aurora Sandbox", "PIX RECEBIDO CLIENTE ACME", 4200, "2026-07-21", "salario", "entrada", false, 0.88),
  tx("txn-002", "acc-aurora-checking", "Banco Aurora Sandbox", "MERCADO SOL NASCENTE", -286.74, "2026-07-20", "mercado", "saida", false, 0.94),
  tx("txn-003", "acc-aurora-checking", "Banco Aurora Sandbox", "UBER TRIP HELP.UBER.COM", -42.9, "2026-07-20", "transporte", "saida", false, 0.91),
  tx("txn-004", "acc-aurora-checking", "Banco Aurora Sandbox", "NETFLIX.COM", -39.9, "2026-07-18", "assinaturas", "saida", true, 0.96),
  tx("txn-005", "acc-aurora-checking", "Banco Aurora Sandbox", "SEGURO AUTO PARCELA", -318.2, "2026-07-17", "servicos", "saida", true, 0.82),
  tx("txn-006", "acc-nexus-savings", "Conta Nexus Sandbox", "APORTE RESERVA CARRO", -700, "2026-07-15", "investimentos", "saida", true, 0.86),
  tx("txn-007", "acc-aurora-checking", "Banco Aurora Sandbox", "RESTAURANTE ESTAÇÃO", -78.4, "2026-07-14", "alimentacao", "saida", false, 0.89),
  tx("txn-008", "acc-aurora-checking", "Banco Aurora Sandbox", "ASSINATURA DESIGN TOOL", -79.9, "2026-07-11", "assinaturas", "saida", true, 0.9),
  tx("txn-009", "acc-aurora-checking", "Banco Aurora Sandbox", "VENDA PRODUTO DIGITAL", 1270, "2026-07-10", "vendas", "entrada", false, 0.92)
];

export const sandboxCreditCards: CreditCard[] = [
  {
    id: "card-aurora-platinum",
    connectionId: "fin-conn-aurora",
    institutionName: "Banco Aurora Sandbox",
    name: "Aurora Platinum",
    finalDigits: "7742",
    limit: brl(12000),
    availableLimit: brl(7120),
    currentBill: brl(4880),
    closingDay: 27,
    dueDay: 5,
    utilization: 41,
    sandbox: true
  }
];

export const sandboxBills: CreditCardBill[] = [
  {
    id: "bill-aurora-2026-08",
    cardId: "card-aurora-platinum",
    dueDate: "2026-08-05",
    closingDate: "2026-07-27",
    amount: brl(4880),
    status: "open",
    projectedAmount: brl(5230),
    confidence: 0.79,
    sandbox: true
  }
];

export const sandboxInvestments: FinancialInvestment[] = [
  {
    id: "inv-nexus-cdb",
    connectionId: "fin-conn-nexus",
    institutionName: "Conta Nexus Sandbox",
    type: "renda_fixa",
    product: "CDB liquidez diaria sandbox",
    balance: brl(11240.35),
    investedAmount: brl(10800),
    updatedAt: "2026-07-22T08:40:00.000Z",
    sandbox: true
  },
  {
    id: "inv-prisma-tesouro",
    connectionId: "fin-conn-nexus",
    institutionName: "Conta Nexus Sandbox",
    type: "tesouro",
    product: "Tesouro Selic sandbox",
    balance: brl(4079.8),
    investedAmount: brl(4000),
    updatedAt: "2026-07-22T08:40:00.000Z",
    sandbox: true
  }
];

export class PluggyFinancialDataProvider implements FinancialDataProvider {
  readonly name: FinancialProviderName = "pluggy";
  private readonly baseUrl = "https://api.pluggy.ai";

  async createConnectToken(input: ConnectTokenInput): Promise<ConnectTokenResult> {
    const sandbox = isOpenFinanceSandbox() || !hasPluggyCredentials();
    const clientUserId = `virada-${input.userId}`;

    if (sandbox) {
      return {
        provider: this.name,
        connectToken: `pluggy_sandbox_${clientUserId}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        mode: "sandbox",
        clientUserId,
        widgetUrl: "https://connect.pluggy.ai/?sandbox=true",
        requiresOfficialWidget: true,
        sandbox: true
      };
    }

    const apiKey = await this.createApiKey();
    const response = await fetch(`${this.baseUrl}/connect_token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        itemId: input.connectionId,
        options: {
          clientUserId,
          webhookUrl: input.webhookUrl,
          oauthRedirectUri: input.redirectUrl,
          avoidDuplicates: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`pluggy_connect_token_failed:${response.status}`);
    }

    const data = (await response.json()) as { accessToken?: string; token?: string; expiresAt?: string };

    return {
      provider: this.name,
      connectToken: data.accessToken ?? data.token ?? "",
      expiresAt: data.expiresAt ?? new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      mode: "production",
      clientUserId,
      widgetUrl: "https://connect.pluggy.ai",
      requiresOfficialWidget: true,
      sandbox: false
    };
  }

  async createConnection(input: CreateConnectionInput): Promise<FinancialConnection> {
    const institution = sandboxInstitutions.find((item) => item.id === input.institutionId) ?? sandboxInstitutions[0];
    return {
      ...sandboxFinancialConnections[0],
      id: input.providerItemId ? `fin-conn-${input.providerItemId}` : "fin-conn-new-sandbox",
      userId: input.userId,
      providerItemId: input.providerItemId ?? "pluggy-item-sandbox-new",
      institutionId: institution.id,
      institutionName: institution.name,
      status: "aguardando_consentimento",
      consentStatus: "pending",
      lastSyncAt: now,
      nextSyncAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      sandbox: true
    };
  }

  async getConnectionStatus(connectionId: string): Promise<FinancialConnectionStatus> {
    return sandboxFinancialConnections.find((connection) => connection.id === connectionId)?.status ?? "atencao_necessaria";
  }

  async listInstitutions(): Promise<FinancialInstitution[]> {
    return sandboxInstitutions;
  }

  async listAccounts(connectionId?: string): Promise<FinancialAccount[]> {
    return filterByConnection(sandboxAccounts, connectionId);
  }

  async listBalances(connectionId?: string): Promise<FinancialBalance[]> {
    if (!connectionId) return sandboxBalances;
    const accountIds = sandboxAccounts.filter((account) => account.connectionId === connectionId).map((account) => account.id);
    return sandboxBalances.filter((balance) => accountIds.includes(balance.accountId));
  }

  async listTransactions(filters?: { connectionId?: string; from?: string; to?: string; category?: FinancialCategory }): Promise<FinancialTransaction[]> {
    return sandboxTransactions.filter((transaction) => {
      if (filters?.connectionId && transaction.connectionId !== filters.connectionId) return false;
      if (filters?.category && transaction.category !== filters.category) return false;
      if (filters?.from && transaction.date < filters.from) return false;
      if (filters?.to && transaction.date > filters.to) return false;
      return true;
    });
  }

  async listCreditCards(connectionId?: string): Promise<CreditCard[]> {
    return filterByConnection(sandboxCreditCards, connectionId);
  }

  async listBills(connectionId?: string): Promise<CreditCardBill[]> {
    if (!connectionId) return sandboxBills;
    const cardIds = sandboxCreditCards.filter((card) => card.connectionId === connectionId).map((card) => card.id);
    return sandboxBills.filter((bill) => cardIds.includes(bill.cardId));
  }

  async listInvestments(connectionId?: string): Promise<FinancialInvestment[]> {
    return filterByConnection(sandboxInvestments, connectionId);
  }

  async refreshConnection(connectionId: string) {
    return {
      status: "sincronizando" as const,
      syncJobId: `sync-${connectionId}-${Date.now()}`,
      message: "Atualizando suas informacoes financeiras. A disponibilidade depende do provider e da instituicao."
    };
  }

  async revokeConnection(connectionId: string) {
    return {
      status: "revogada" as const,
      revokedAt: new Date().toISOString(),
      message: `Consentimento ${connectionId} revogado no contrato do Virada IA. Em producao, o backend tambem chama o provider.`
    };
  }

  async handleWebhook(payload: Record<string, unknown>): Promise<FinancialWebhookEvent> {
    const event = String(payload.event ?? payload.webhook_code ?? "unknown");
    const eventId = String(payload.eventId ?? payload.webhook_id ?? `${event}-${Date.now()}`);
    const providerItemId = optionalString(payload.itemId ?? payload.link_id);
    const connectionId = providerItemId ? `fin-conn-${providerItemId}` : undefined;

    return {
      provider: this.name,
      eventId,
      event,
      providerItemId,
      connectionId,
      status: "accepted",
      shouldSync: /created|updated|available|login_succeeded|transactions/i.test(event),
      idempotencyKey: `${this.name}:${eventId}`,
      receivedAt: new Date().toISOString(),
      sanitizedRaw: sanitizeWebhookPayload(payload)
    };
  }

  private async createApiKey() {
    const clientId = process.env.PLUGGY_CLIENT_ID;
    const clientSecret = process.env.PLUGGY_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("pluggy_credentials_missing");

    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret })
    });

    if (!response.ok) throw new Error(`pluggy_auth_failed:${response.status}`);
    const data = (await response.json()) as { apiKey?: string; accessToken?: string };
    const apiKey = data.apiKey ?? data.accessToken;
    if (!apiKey) throw new Error("pluggy_api_key_missing");
    return apiKey;
  }
}

export class BelvoFinancialDataProvider extends PluggyFinancialDataProvider {
  override readonly name: FinancialProviderName = "belvo";

  override async createConnectToken(input: ConnectTokenInput): Promise<ConnectTokenResult> {
    return {
      provider: this.name,
      connectToken: `belvo_sandbox_${input.userId}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      mode: "sandbox",
      clientUserId: `virada-${input.userId}`,
      widgetUrl: "https://sandbox.belvo.com/",
      requiresOfficialWidget: true,
      sandbox: true
    };
  }
}

export function getFinancialDataProvider(): FinancialDataProvider {
  const provider = (process.env.FINANCIAL_DATA_PROVIDER ?? "pluggy").toLowerCase();
  if (provider === "belvo") return new BelvoFinancialDataProvider();
  return new PluggyFinancialDataProvider();
}

export function categorizeTransaction(input: {
  description: string;
  amount: number;
  previousUserCategory?: FinancialCategory;
}): { category: FinancialCategory; confidence: number; reason: string; requiresConfirmation: boolean } {
  if (input.previousUserCategory) {
    return {
      category: input.previousUserCategory,
      confidence: 0.99,
      reason: "historico_de_correcao_do_usuario",
      requiresConfirmation: false
    };
  }

  const normalized = normalize(input.description);
  const rules: Array<{ pattern: RegExp; category: FinancialCategory; confidence: number }> = [
    { pattern: /(ifood|restaurante|lanchonete|padaria|cafe)/, category: "alimentacao", confidence: 0.9 },
    { pattern: /(mercado|supermercado|atacadao|horti)/, category: "mercado", confidence: 0.94 },
    { pattern: /(uber|99|posto|combustivel|metro|onibus)/, category: "transporte", confidence: 0.9 },
    { pattern: /(aluguel|condominio|energia|internet|agua)/, category: "moradia", confidence: 0.88 },
    { pattern: /(farmacia|consulta|dentista|hospital|laboratorio)/, category: "saude", confidence: 0.89 },
    { pattern: /(curso|faculdade|livro|aula)/, category: "educacao", confidence: 0.86 },
    { pattern: /(cinema|show|spotify|netflix|prime|streaming)/, category: "assinaturas", confidence: 0.86 },
    { pattern: /(hotel|passagem|airbnb|viagem)/, category: "viagens", confidence: 0.87 },
    { pattern: /(loja|shopping|amazon|magazine)/, category: "compras", confidence: 0.8 },
    { pattern: /(seguro|design tool|software|saas|servico)/, category: "servicos", confidence: 0.82 },
    { pattern: /(imposto|taxa|darf|ipva|licenciamento)/, category: "impostos", confidence: 0.9 },
    { pattern: /(pix enviado|transferencia|ted|doc)/, category: "transferencias", confidence: 0.82 },
    { pattern: /(aporte|cdb|tesouro|invest)/, category: "investimentos", confidence: 0.88 },
    { pattern: /(salario|pro labore)/, category: "salario", confidence: 0.9 },
    { pattern: /(venda|cliente|recebido)/, category: "vendas", confidence: 0.84 }
  ];

  const match = rules.find((rule) => rule.pattern.test(normalized));
  if (match) {
    return {
      category: match.category,
      confidence: match.confidence,
      reason: "regra_deterministica",
      requiresConfirmation: match.confidence < 0.84
    };
  }

  return {
    category: input.amount >= 0 ? "outras_entradas" : "outros_gastos",
    confidence: 0.52,
    reason: "fallback_ia_pendente",
    requiresConfirmation: true
  };
}

export function detectRecurringSubscriptions(transactions = sandboxTransactions): FinancialSubscription[] {
  const recurring = transactions.filter((transaction) => transaction.recurring && transaction.type === "saida");
  return recurring.map((transaction) => ({
    id: `sub-${transaction.id}`,
    service: transaction.normalizedDescription,
    amount: brl(Math.abs(transaction.amount.amount)),
    frequency: "mensal",
    nextChargeDate: nextMonthSameDay(transaction.date),
    accountOrCard: transaction.institutionName,
    status: transaction.confidence >= 0.9 ? "confirmada" : "provavel",
    confidence: transaction.confidence,
    sandbox: transaction.sandbox
  }));
}

export function buildFinancialOverview(
  accounts = sandboxAccounts,
  transactions = sandboxTransactions,
  bills = sandboxBills
): FinancialOverview {
  const consolidatedBalance = accounts.reduce((sum, account) => sum + account.balance.amount, 0);
  const income = transactions.filter((transaction) => transaction.type === "entrada").reduce((sum, transaction) => sum + transaction.amount.amount, 0);
  const outcome = Math.abs(transactions.filter((transaction) => transaction.type === "saida").reduce((sum, transaction) => sum + transaction.amount.amount, 0));
  const subscriptions = detectRecurringSubscriptions(transactions);
  const byCategory = transactions
    .filter((transaction) => transaction.type === "saida")
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + Math.abs(transaction.amount.amount);
      return acc;
    }, {});

  const categoryDistribution = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category: category as FinancialCategory,
      amount: brl(amount),
      percent: outcome ? Math.round((amount / outcome) * 100) : 0
    }));

  return {
    consolidatedBalance: brl(consolidatedBalance),
    incomeThisMonth: brl(income),
    outcomeThisMonth: brl(outcome),
    savingsThisMonth: brl(income - outcome),
    cashflowForecast: brl(consolidatedBalance + income - outcome - (bills[0]?.projectedAmount.amount ?? 0)),
    connectedInstitutions: new Set(accounts.map((account) => account.institutionName)).size,
    lastSyncAt: accounts.map((account) => account.updatedAt).sort().at(-1) ?? now,
    nextBill: bills[0],
    subscriptions,
    categoryDistribution,
    alerts: [
      "Fatura sandbox vence em 05/08. Posso criar um lembrete antes do vencimento.",
      "Servicos e assinaturas concentram cobrancas recorrentes provaveis.",
      "Dados financeiros estao marcados como sandbox ate uma conexao oficial ser validada pelo backend."
    ],
    sandbox: true
  };
}

export function sanitizeForFinancialAgent(input: {
  overview?: FinancialOverview;
  accounts?: FinancialAccount[];
  transactions?: FinancialTransaction[];
}) {
  return {
    overview: input.overview,
    accounts: (input.accounts ?? sandboxAccounts).map((account) => ({
      id: account.id,
      institutionName: account.institutionName,
      name: account.name,
      type: account.type,
      numberMask: account.numberMask,
      balance: account.balance,
      sandbox: account.sandbox
    })),
    transactions: (input.transactions ?? sandboxTransactions).map((transaction) => ({
      id: transaction.id,
      institutionName: transaction.institutionName,
      normalizedDescription: transaction.normalizedDescription,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      type: transaction.type,
      recurring: transaction.recurring,
      confidence: transaction.confidence,
      sandbox: transaction.sandbox
    })),
    sensitiveFieldsRemoved: ["cpf", "full_account_number", "full_card_number", "token", "password", "raw_payload"]
  };
}

export function maskAccount(value: string) {
  const digits = value.replace(/\D/g, "");
  return `**** ${digits.slice(-4) || "0000"}`;
}

export function brl(amount: number): Money {
  return { amount: Number(amount.toFixed(2)), currency: "BRL" };
}

function tx(
  id: string,
  accountId: string,
  institutionName: string,
  description: string,
  amount: number,
  date: string,
  category: FinancialCategory,
  type: "entrada" | "saida",
  recurring: boolean,
  confidence: number
): FinancialTransaction {
  const account = sandboxAccounts.find((item) => item.id === accountId) ?? sandboxAccounts[0];
  return {
    id,
    connectionId: account.connectionId,
    accountId,
    institutionName,
    originalDescription: description,
    normalizedDescription: normalizeDescription(description),
    amount: brl(amount),
    date,
    category,
    type,
    status: "posted",
    recurring,
    confidence,
    source: "pluggy",
    externalId: `pluggy-${id}`,
    syncedAt: now,
    rawPreserved: true,
    sandbox: true
  };
}

function filterByConnection<T extends { connectionId: string }>(items: T[], connectionId?: string) {
  return connectionId ? items.filter((item) => item.connectionId === connectionId) : items;
}

function isOpenFinanceSandbox() {
  return process.env.OPEN_FINANCE_SANDBOX !== "false" || process.env.APP_ENV !== "production";
}

function hasPluggyCredentials() {
  return Boolean(process.env.PLUGGY_CLIENT_ID && process.env.PLUGGY_CLIENT_SECRET);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length ? value : undefined;
}

function sanitizeWebhookPayload(payload: Record<string, unknown>) {
  const blocked = new Set(["password", "token", "accessToken", "refreshToken", "clientSecret", "cpf", "cardNumber"]);
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !blocked.has(key)));
}

function normalizeDescription(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function nextMonthSameDay(date: string) {
  const current = new Date(`${date}T12:00:00.000Z`);
  current.setUTCMonth(current.getUTCMonth() + 1);
  return current.toISOString().slice(0, 10);
}
