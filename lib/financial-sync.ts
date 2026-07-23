import { getRuntimeEnv } from "@/lib/security";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { isUuid } from "@/lib/finance-access";
import {
  buildFinancialOverview,
  getFinancialDataProvider,
  type FinancialConnection,
  type FinancialOverview
} from "@/lib/financial-provider";
import {
  persistFinancialSnapshot,
  recordFinancialSyncJob,
  type FinancialPersistenceResult,
  type FinancialSnapshot
} from "@/lib/financial-store";

export type FinancialSyncKind = "initial" | "incremental" | "manual" | "webhook";

export type FinancialSyncInput = {
  userId: string;
  connectionId?: string;
  kind: FinancialSyncKind;
  from?: string;
  to?: string;
  force?: boolean;
};

export type FinancialSyncResult = {
  ok: boolean;
  provider: string;
  sandbox: boolean;
  readOnly: true;
  kind: FinancialSyncKind;
  idempotencyKey: string;
  stats: Record<string, number>;
  overview: FinancialOverview;
  persistence: FinancialPersistenceResult;
  syncedAt: string;
};

export type FinancialCronSyncResult = {
  ok: boolean;
  readOnly: true;
  users: number;
  results: FinancialSyncResult[];
  syncedAt: string;
};

export async function runFinancialSync(input: FinancialSyncInput): Promise<FinancialSyncResult> {
  const provider = getFinancialDataProvider();
  const targets = await listFinancialSyncTargets(input.userId, input.connectionId);
  const selectedTargets = input.connectionId
    ? targets.filter((connection) => connection.id === input.connectionId || connection.providerItemId === input.connectionId || connection.id === `fin-conn-${input.connectionId}`)
    : targets;

  const snapshots = await Promise.all(
    selectedTargets.map(async (connection) => {
      await recordFinancialSyncJob({
        userId: input.userId,
        providerItemId: connection.providerItemId,
        kind: input.kind,
        status: "running",
        idempotencyKey: buildSyncIdempotencyKey(input, connection)
      });

      const [accounts, balances, transactions, creditCards, bills, investments] = await Promise.all([
        provider.listAccounts(connection.id),
        provider.listBalances(connection.id),
        provider.listTransactions({ connectionId: connection.id, from: input.from, to: input.to }),
        provider.listCreditCards(connection.id),
        provider.listBills(connection.id),
        provider.listInvestments(connection.id)
      ]);

      return {
        connections: [connection],
        accounts,
        balances,
        transactions,
        creditCards,
        bills,
        investments
      };
    })
  );

  const snapshot: FinancialSnapshot = {
    userId: input.userId,
    connections: snapshots.flatMap((item) => item.connections),
    accounts: snapshots.flatMap((item) => item.accounts),
    balances: snapshots.flatMap((item) => item.balances),
    transactions: snapshots.flatMap((item) => item.transactions),
    creditCards: snapshots.flatMap((item) => item.creditCards),
    bills: snapshots.flatMap((item) => item.bills),
    investments: snapshots.flatMap((item) => item.investments)
  };

  const persistence = await persistFinancialSnapshot(snapshot);
  const overview = buildFinancialOverview(snapshot.accounts, snapshot.transactions, snapshot.bills);
  const stats = {
    connections: snapshot.connections.length,
    accounts: snapshot.accounts.length,
    balances: snapshot.balances.length,
    transactions: snapshot.transactions.length,
    creditCards: snapshot.creditCards.length,
    bills: snapshot.bills.length,
    investments: snapshot.investments.length
  };

  await Promise.all(
    snapshot.connections.map((connection) =>
      recordFinancialSyncJob({
        userId: input.userId,
        providerItemId: connection.providerItemId,
        kind: input.kind,
        status: "done",
        idempotencyKey: buildSyncIdempotencyKey(input, connection),
        stats
      })
    )
  );

  return {
    ok: true,
    provider: provider.name,
    sandbox: snapshot.connections.every((connection) => connection.sandbox),
    readOnly: true,
    kind: input.kind,
    idempotencyKey: buildBatchIdempotencyKey(input),
    stats,
    overview,
    persistence,
    syncedAt: new Date().toISOString()
  };
}

export async function runFinancialCronSync(): Promise<FinancialCronSyncResult> {
  const env = getRuntimeEnv();
  const supabase = createSupabaseAdminClient();
  const userIds = new Set<string>();

  if (supabase) {
    const result = await supabase.from("financial_connections").select("user_id").neq("status", "revogada");
    if (result.error) throw new Error(`financial_connections_cron:${result.error.message}`);
    (result.data ?? []).forEach((row) => {
      if (typeof row.user_id === "string") userIds.add(row.user_id);
    });
  }

  if (!userIds.size && (env.OPEN_FINANCE_SANDBOX !== "false" || env.APP_ENV !== "production")) {
    userIds.add(env.OPEN_FINANCE_SYSTEM_USER_ID ?? "demo-user");
  }

  const results = await Promise.all(
    Array.from(userIds).map((userId) =>
      runFinancialSync({
        userId,
        kind: "incremental"
      })
    )
  );

  return {
    ok: results.every((result) => result.ok),
    readOnly: true,
    users: userIds.size,
    results,
    syncedAt: new Date().toISOString()
  };
}

export async function listFinancialSyncTargets(userId: string, connectionId?: string): Promise<FinancialConnection[]> {
  const env = getRuntimeEnv();
  const provider = getFinancialDataProvider();
  const supabase = createSupabaseAdminClient();

  if (supabase && isUuid(userId)) {
    let query = supabase
      .from("financial_connections")
      .select("provider, provider_item_id, status, consent_status, consent_expires_at, last_sync_at, next_sync_at, products_authorized, sandbox, financial_institutions(provider_institution_id,name)")
      .eq("user_id", userId)
      .neq("status", "revogada");

    if (connectionId) {
      const providerItemId = connectionId.replace("fin-conn-", "");
      query = isUuid(connectionId) ? query.or(`provider_item_id.eq.${providerItemId},id.eq.${connectionId}`) : query.eq("provider_item_id", providerItemId);
    }

    const result = await query;
    if (result.error) throw new Error(`financial_connections:${result.error.message}`);
    if (result.data?.length) {
      return result.data.map((row) => {
        const institution = normalizeInstitution(row.financial_institutions);
        return {
          id: `fin-conn-${row.provider_item_id}`,
          userId,
          provider: row.provider,
          providerItemId: row.provider_item_id,
          institutionId: institution.id,
          institutionName: institution.name,
          status: row.status,
          consentStatus: row.consent_status,
          consentExpiresAt: row.consent_expires_at ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastSyncAt: row.last_sync_at ?? new Date().toISOString(),
          nextSyncAt: row.next_sync_at ?? new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          products: row.products_authorized ?? ["accounts", "balances", "transactions"],
          accountName: "Conexao Open Finance",
          accountType: "checking",
          accountMask: "****",
          holderMask: "Titular protegido",
          sandbox: row.sandbox
        };
      });
    }
  }

  if (env.OPEN_FINANCE_SANDBOX !== "false" || env.APP_ENV !== "production") {
    return provider.listConnections(userId);
  }

  return [];
}

export function isValidCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.APP_ENV !== "production";
  const authorization = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");
  return authorization === `Bearer ${secret}` || cronHeader === secret;
}

function buildSyncIdempotencyKey(input: FinancialSyncInput, connection: FinancialConnection) {
  return [input.kind, input.userId, connection.provider, connection.providerItemId, input.from ?? "auto", input.to ?? "auto"].join(":");
}

function buildBatchIdempotencyKey(input: FinancialSyncInput) {
  return [input.kind, input.userId, input.connectionId ?? "all", input.from ?? "auto", input.to ?? "auto"].join(":");
}

function normalizeInstitution(value: unknown): { id: string; name: string } {
  const row = Array.isArray(value) ? value[0] : value;
  if (row && typeof row === "object") {
    const item = row as { provider_institution_id?: string; name?: string };
    return {
      id: item.provider_institution_id ?? "pluggy-production",
      name: item.name ?? "Instituicao Open Finance"
    };
  }

  return { id: "pluggy-production", name: "Instituicao Open Finance" };
}
