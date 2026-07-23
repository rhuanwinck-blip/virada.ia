import crypto from "crypto";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase";
import { isUuid } from "@/lib/finance-access";
import {
  detectRecurringSubscriptions,
  type CreditCard,
  type CreditCardBill,
  type FinancialAccount,
  type FinancialBalance,
  type FinancialConnection,
  type FinancialInvestment,
  type FinancialSubscription,
  type FinancialTransaction,
  type FinancialWebhookEvent
} from "@/lib/financial-provider";

export type FinancialSnapshot = {
  userId: string;
  connections: FinancialConnection[];
  accounts: FinancialAccount[];
  balances: FinancialBalance[];
  transactions: FinancialTransaction[];
  creditCards: CreditCard[];
  bills: CreditCardBill[];
  investments: FinancialInvestment[];
};

export type FinancialPersistenceResult = {
  persisted: boolean;
  reason?: string;
  tables: Record<string, number>;
};

type SupabaseResult = {
  error?: { message?: string } | null;
};

export function canPersistFinanceForUser(userId: string) {
  return isUuid(userId) && isSupabaseAdminConfigured();
}

export async function persistFinancialSnapshot(snapshot: FinancialSnapshot): Promise<FinancialPersistenceResult> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return skipped("supabase_admin_not_configured");
  if (!isUuid(snapshot.userId)) return skipped("finance_user_id_must_be_uuid_for_persistence");
  if (!snapshot.connections.length) return skipped("no_connections_to_persist");

  const tables: Record<string, number> = {};
  const institutions = uniqueBy(
    snapshot.connections.map((connection) => ({
      provider: connection.provider,
      provider_institution_id: connection.institutionId,
      name: connection.institutionName,
      brand_name: connection.institutionName,
      country: "BR",
      products: connection.products,
      sandbox: connection.sandbox
    })),
    (row) => `${row.provider}:${row.provider_institution_id}`
  );

  const institutionResult = await supabase
    .from("financial_institutions")
    .upsert(institutions, { onConflict: "provider,provider_institution_id" })
    .select("id, provider, provider_institution_id");
  assertOk(institutionResult, "financial_institutions");
  tables.financial_institutions = institutions.length;

  const institutionIds = new Map(
    (institutionResult.data ?? []).map((row: { id: string; provider: string; provider_institution_id: string }) => [
      `${row.provider}:${row.provider_institution_id}`,
      row.id
    ])
  );

  const connectionRows = snapshot.connections.map((connection) => ({
    user_id: snapshot.userId,
    provider: connection.provider,
    provider_item_id: connection.providerItemId,
    institution_id: institutionIds.get(`${connection.provider}:${connection.institutionId}`),
    status: connection.status,
    consent_status: connection.consentStatus,
    consent_expires_at: connection.consentExpiresAt,
    last_sync_at: connection.lastSyncAt,
    next_sync_at: connection.nextSyncAt,
    products_authorized: connection.products,
    error_code: connection.errorCode,
    error_message: connection.errorMessage,
    sandbox: connection.sandbox,
    updated_at: new Date().toISOString()
  }));

  const connectionResult = await supabase
    .from("financial_connections")
    .upsert(connectionRows, { onConflict: "user_id,provider,provider_item_id" })
    .select("id, provider_item_id");
  assertOk(connectionResult, "financial_connections");
  tables.financial_connections = connectionRows.length;

  const connectionIds = new Map(
    (connectionResult.data ?? []).map((row: { id: string; provider_item_id: string }) => [row.provider_item_id, row.id])
  );

  const accountRows = snapshot.accounts.flatMap((account) => {
    const connection = snapshot.connections.find((item) => item.id === account.connectionId);
    const connectionId = connection ? connectionIds.get(connection.providerItemId) : undefined;
    if (!connectionId) return [];
    return [
      {
        user_id: snapshot.userId,
        connection_id: connectionId,
        provider_account_id: account.id,
        institution_name: account.institutionName,
        name: account.name,
        type: account.type,
        number_mask: account.numberMask,
        holder_mask: account.holderMask,
        currency: account.balance.currency,
        raw_last_four: account.numberMask.slice(-4),
        sandbox: account.sandbox,
        updated_at: account.updatedAt
      }
    ];
  });

  const accountResult = accountRows.length
    ? await supabase.from("financial_accounts").upsert(accountRows, { onConflict: "connection_id,provider_account_id" }).select("id, provider_account_id")
    : { data: [], error: null };
  assertOk(accountResult, "financial_accounts");
  tables.financial_accounts = accountRows.length;

  const accountIds = new Map((accountResult.data ?? []).map((row: { id: string; provider_account_id: string }) => [row.provider_account_id, row.id]));
  const balanceRows = snapshot.balances.flatMap((balance) => {
    const accountId = accountIds.get(balance.accountId);
    if (!accountId) return [];
    return [
      {
        user_id: snapshot.userId,
        account_id: accountId,
        available_cents: cents(balance.available.amount),
        current_cents: cents(balance.current.amount),
        blocked_cents: cents(balance.blocked?.amount ?? 0),
        currency: balance.current.currency,
        provider_updated_at: balance.updatedAt
      }
    ];
  });

  const balanceResult = balanceRows.length
    ? await supabase.from("financial_balances").upsert(balanceRows, { onConflict: "account_id,provider_updated_at" })
    : { error: null };
  assertOk(balanceResult, "financial_balances");
  tables.financial_balances = balanceRows.length;

  const rawRows = snapshot.transactions.flatMap((transaction) => {
    const connection = snapshot.connections.find((item) => item.id === transaction.connectionId);
    const connectionId = connection ? connectionIds.get(connection.providerItemId) : undefined;
    if (!connectionId) return [];
    const payload = sanitizedTransactionPayload(transaction);
    return [
      {
        user_id: snapshot.userId,
        connection_id: connectionId,
        provider: transaction.source,
        provider_transaction_id: transaction.externalId,
        raw_payload: payload,
        payload_hash: hashJson(payload)
      }
    ];
  });

  const rawResult = rawRows.length
    ? await supabase
        .from("financial_transaction_raw")
        .upsert(rawRows, { onConflict: "provider,provider_transaction_id,payload_hash" })
        .select("id, provider_transaction_id")
    : { data: [], error: null };
  assertOk(rawResult, "financial_transaction_raw");
  tables.financial_transaction_raw = rawRows.length;

  const rawIds = new Map((rawResult.data ?? []).map((row: { id: string; provider_transaction_id: string }) => [row.provider_transaction_id, row.id]));
  const transactionRows = snapshot.transactions.flatMap((transaction) => {
    const connection = snapshot.connections.find((item) => item.id === transaction.connectionId);
    const connectionId = connection ? connectionIds.get(connection.providerItemId) : undefined;
    if (!connectionId) return [];
    return [
      {
        user_id: snapshot.userId,
        connection_id: connectionId,
        account_id: accountIds.get(transaction.accountId),
        raw_id: rawIds.get(transaction.externalId),
        provider_transaction_id: transaction.externalId,
        original_description: transaction.originalDescription,
        normalized_description: transaction.normalizedDescription,
        amount_cents: cents(transaction.amount.amount),
        currency: transaction.amount.currency,
        transaction_date: transaction.date,
        institution_name: transaction.institutionName,
        category_key: transaction.category,
        type: transaction.type,
        status: transaction.status,
        recurrence_status: transaction.recurring ? "candidate" : "none",
        note: transaction.note,
        source: transaction.source,
        external_id: transaction.externalId,
        synced_at: transaction.syncedAt,
        hidden_from_analysis: Boolean(transaction.hiddenFromAnalysis),
        updated_at: new Date().toISOString()
      }
    ];
  });

  const transactionResult = transactionRows.length
    ? await supabase.from("financial_transactions").upsert(transactionRows, { onConflict: "connection_id,provider_transaction_id" })
    : { error: null };
  assertOk(transactionResult, "financial_transactions");
  tables.financial_transactions = transactionRows.length;

  const cardRows = snapshot.creditCards.flatMap((card) => {
    const connection = snapshot.connections.find((item) => item.id === card.connectionId);
    const connectionId = connection ? connectionIds.get(connection.providerItemId) : undefined;
    if (!connectionId) return [];
    return [
      {
        user_id: snapshot.userId,
        connection_id: connectionId,
        provider_card_id: card.id,
        institution_name: card.institutionName,
        name: card.name,
        final_digits: card.finalDigits,
        limit_cents: cents(card.limit.amount),
        available_limit_cents: cents(card.availableLimit.amount),
        closing_day: card.closingDay,
        due_day: card.dueDay,
        sandbox: card.sandbox,
        updated_at: new Date().toISOString()
      }
    ];
  });

  const cardResult = cardRows.length
    ? await supabase.from("credit_cards").upsert(cardRows, { onConflict: "connection_id,provider_card_id" }).select("id, provider_card_id")
    : { data: [], error: null };
  assertOk(cardResult, "credit_cards");
  tables.credit_cards = cardRows.length;

  const cardIds = new Map((cardResult.data ?? []).map((row: { id: string; provider_card_id: string }) => [row.provider_card_id, row.id]));
  const billRows = snapshot.bills.flatMap((bill) => {
    const cardId = cardIds.get(bill.cardId);
    if (!cardId) return [];
    return [
      {
        user_id: snapshot.userId,
        card_id: cardId,
        due_date: bill.dueDate,
        closing_date: bill.closingDate,
        amount_cents: cents(bill.amount.amount),
        projected_amount_cents: cents(bill.projectedAmount.amount),
        status: bill.status,
        confidence: bill.confidence,
        updated_at: new Date().toISOString()
      }
    ];
  });

  const billResult = billRows.length ? await supabase.from("credit_card_bills").upsert(billRows, { onConflict: "card_id,due_date" }) : { error: null };
  assertOk(billResult, "credit_card_bills");
  tables.credit_card_bills = billRows.length;

  const investmentRows = snapshot.investments.flatMap((investment) => {
    const connection = snapshot.connections.find((item) => item.id === investment.connectionId);
    const connectionId = connection ? connectionIds.get(connection.providerItemId) : undefined;
    if (!connectionId) return [];
    return [
      {
        user_id: snapshot.userId,
        connection_id: connectionId,
        provider_investment_id: investment.id,
        institution_name: investment.institutionName,
        type: investment.type,
        product: investment.product,
        balance_cents: cents(investment.balance.amount),
        invested_amount_cents: cents(investment.investedAmount.amount),
        provider_updated_at: investment.updatedAt,
        manual: investment.type === "manual",
        raw_payload: { id: investment.id, sandbox: investment.sandbox },
        updated_at: new Date().toISOString()
      }
    ];
  });

  const investmentResult = investmentRows.length
    ? await supabase.from("financial_investments").upsert(investmentRows, { onConflict: "connection_id,provider_investment_id" })
    : { error: null };
  assertOk(investmentResult, "financial_investments");
  tables.financial_investments = investmentRows.length;

  const subscriptions = detectRecurringSubscriptions(snapshot.transactions);
  const subscriptionRows = subscriptions.map((subscription) => mapSubscription(snapshot.userId, subscription));
  const subscriptionResult = subscriptionRows.length
    ? await supabase.from("financial_subscriptions").upsert(subscriptionRows, { onConflict: "user_id,source_fingerprint" })
    : { error: null };
  assertOk(subscriptionResult, "financial_subscriptions");
  tables.financial_subscriptions = subscriptionRows.length;

  await insertAuditLog(snapshot.userId, "financial.snapshot.persisted", "financial_snapshot", undefined, { tables });

  return { persisted: true, tables };
}

export async function recordFinancialWebhookEvent(input: {
  event: FinancialWebhookEvent;
  signatureValid: boolean;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return skipped("supabase_admin_not_configured");

  const connection = input.event.providerItemId
    ? await supabase
        .from("financial_connections")
        .select("id,user_id")
        .eq("provider", input.event.provider)
        .eq("provider_item_id", input.event.providerItemId)
        .maybeSingle()
    : { data: null, error: null };
  assertOk(connection, "financial_connections_lookup");

  const row = {
    provider: input.event.provider,
    event_id: input.event.eventId,
    user_id: connection.data?.user_id,
    connection_id: connection.data?.id,
    event: input.event.event,
    signature_valid: input.signatureValid,
    idempotency_key: input.event.idempotencyKey,
    sanitized_payload: input.event.sanitizedRaw,
    processed_at: input.event.shouldSync ? null : new Date().toISOString()
  };

  const result = await supabase.from("financial_webhook_events").upsert(row, { onConflict: "idempotency_key" });
  assertOk(result, "financial_webhook_events");
  return { persisted: true, tables: { financial_webhook_events: 1 } };
}

export async function recordFinancialSyncJob(input: {
  userId: string;
  providerItemId: string;
  kind: "initial" | "incremental" | "manual" | "webhook";
  status: "queued" | "running" | "done" | "failed" | "retrying";
  idempotencyKey: string;
  stats?: Record<string, number | string | boolean>;
  errorCode?: string;
  errorMessage?: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !isUuid(input.userId)) return skipped("sync_job_not_persisted");

  const connection = await supabase
    .from("financial_connections")
    .select("id")
    .eq("user_id", input.userId)
    .eq("provider_item_id", input.providerItemId)
    .maybeSingle();
  assertOk(connection, "financial_sync_job_connection_lookup");
  if (!connection.data?.id) return skipped("financial_connection_not_found");

  const now = new Date().toISOString();
  const result = await supabase.from("financial_sync_jobs").upsert(
    {
      user_id: input.userId,
      connection_id: connection.data.id,
      kind: input.kind,
      status: input.status,
      idempotency_key: input.idempotencyKey,
      started_at: input.status === "running" ? now : undefined,
      finished_at: input.status === "done" || input.status === "failed" ? now : undefined,
      error_code: input.errorCode,
      error_message: input.errorMessage,
      stats: input.stats ?? {}
    },
    { onConflict: "idempotency_key" }
  );
  assertOk(result, "financial_sync_jobs");
  return { persisted: true, tables: { financial_sync_jobs: 1 } };
}

export async function removeFinancialData(input: { userId: string; connectionId?: string }) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !isUuid(input.userId)) return skipped("remove_data_not_persisted");

  let query = supabase.from("financial_connections").delete().eq("user_id", input.userId);
  if (input.connectionId) {
    const providerItemId = input.connectionId.replace("fin-conn-", "");
    query = isUuid(input.connectionId) ? query.or(`id.eq.${input.connectionId},provider_item_id.eq.${providerItemId}`) : query.eq("provider_item_id", providerItemId);
  }

  const result = await query;
  assertOk(result, "financial_connections_delete");
  await insertAuditLog(input.userId, "financial.data.removed", "financial_connection", input.connectionId, {});
  return { persisted: true, tables: { financial_connections: 1 } };
}

function mapSubscription(userId: string, subscription: FinancialSubscription) {
  return {
    user_id: userId,
    service: subscription.service,
    amount_cents: cents(subscription.amount.amount),
    frequency: subscription.frequency,
    next_charge_date: subscription.nextChargeDate,
    account_or_card: subscription.accountOrCard,
    status: subscription.status,
    confidence: subscription.confidence,
    source_fingerprint: hashJson({
      service: subscription.service,
      amount: subscription.amount.amount,
      frequency: subscription.frequency,
      accountOrCard: subscription.accountOrCard
    }),
    updated_at: new Date().toISOString()
  };
}

async function insertAuditLog(userId: string, action: string, resourceType: string, resourceId: string | undefined, metadata: Record<string, unknown>) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !isUuid(userId)) return;
  const result = await supabase.from("audit_logs").insert({
    user_id: userId,
    actor_type: "system",
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata
  });
  assertOk(result, "audit_logs");
}

function sanitizedTransactionPayload(transaction: FinancialTransaction) {
  return {
    provider: transaction.source,
    externalId: transaction.externalId,
    originalDescription: transaction.originalDescription,
    amount: transaction.amount,
    date: transaction.date,
    status: transaction.status,
    category: transaction.category,
    rawPreserved: transaction.rawPreserved,
    sandbox: transaction.sandbox
  };
}

function cents(amount: number) {
  return Math.round(amount * 100);
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function hashJson(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function skipped(reason: string): FinancialPersistenceResult {
  return { persisted: false, reason, tables: {} };
}

function assertOk(result: SupabaseResult, table: string) {
  if (result.error) throw new Error(`${table}:${result.error.message ?? "supabase_error"}`);
}
