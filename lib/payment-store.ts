import { createSupabaseAdminClient } from "@/lib/supabase";
import type { MercadoPagoPayment, PaymentState } from "@/lib/payments";

export type CheckoutReference = {
  plan: "one-time" | "pro";
  contextId?: string;
  requestId?: string;
};

export type PaymentAccessPersistenceResult = {
  persisted: boolean;
  paymentId?: string;
  entitlementStatus?: "active" | "pending" | "cancelled";
  accessExpiresAt?: string;
  reason?: string;
};

const entitlementStatusByPayment: Record<PaymentState | "unknown", "active" | "pending" | "cancelled"> = {
  approved: "active",
  pending: "pending",
  in_process: "pending",
  rejected: "cancelled",
  cancelled: "cancelled",
  refunded: "cancelled",
  charged_back: "cancelled",
  unknown: "pending"
};

export function parseCheckoutReference(reference?: string): CheckoutReference | null {
  if (!reference) return null;

  const [plan, contextId, requestId] = reference.split(":");
  if (plan !== "one-time" && plan !== "pro") return null;

  return {
    plan,
    contextId: contextId && contextId !== "direct" ? contextId : undefined,
    requestId
  };
}

export function getAccessExpiresAt(plan: "one-time" | "pro", paidAt = new Date()) {
  const expiresAt = new Date(paidAt);
  expiresAt.setDate(expiresAt.getDate() + (plan === "pro" ? 31 : 30));
  return expiresAt.toISOString();
}

export function getEntitlementStatus(status: PaymentState | "unknown") {
  return entitlementStatusByPayment[status] ?? "pending";
}

export async function upsertPaymentAccess(input: {
  payment: MercadoPagoPayment;
  rawEvent: Record<string, unknown>;
}): Promise<PaymentAccessPersistenceResult> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { persisted: false, reason: "supabase_admin_not_configured" };

  const reference = parseCheckoutReference(input.payment.externalReference);
  const plan = reference?.plan ?? readPlanFromMetadata(input.payment.metadata) ?? "one-time";
  const paidAt = input.payment.dateApproved ? new Date(input.payment.dateApproved) : new Date();
  const accessExpiresAt = getAccessExpiresAt(plan, paidAt);
  const entitlementStatus = getEntitlementStatus(input.payment.status);
  const amountCents = Math.round((input.payment.transactionAmount ?? 0) * 100);
  const idempotencyKey = ["mercado-pago", input.payment.id, input.payment.status].join(":");

  const paymentResult = await supabase
    .from("payments")
    .upsert(
      {
        provider: "mercado-pago",
        provider_payment_id: input.payment.id,
        plan_key: plan,
        status: input.payment.status,
        amount_cents: amountCents,
        idempotency_key: idempotencyKey,
        raw_event: {
          providerPayment: {
            id: input.payment.id,
            status: input.payment.status,
            statusDetail: input.payment.statusDetail,
            externalReference: input.payment.externalReference,
            transactionAmount: input.payment.transactionAmount,
            currencyId: input.payment.currencyId,
            email: input.payment.email
          },
          webhook: input.rawEvent
        },
        email: input.payment.email,
        external_reference: input.payment.externalReference,
        paid_at: input.payment.status === "approved" ? paidAt.toISOString() : null,
        access_expires_at: input.payment.status === "approved" ? accessExpiresAt : null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "provider_payment_id" }
    )
    .select("id")
    .single();

  if (paymentResult.error) {
    return { persisted: false, reason: paymentResult.error.message };
  }

  if (!paymentResult.data?.id || !input.payment.email) {
    return {
      persisted: true,
      paymentId: paymentResult.data?.id,
      entitlementStatus,
      accessExpiresAt: input.payment.status === "approved" ? accessExpiresAt : undefined,
      reason: input.payment.email ? undefined : "missing_payment_email"
    };
  }

  const entitlementResult = await supabase.from("user_entitlements").upsert(
    {
      email: input.payment.email.toLowerCase(),
      plan_key: plan,
      status: entitlementStatus,
      source: "payment",
      provider: "mercado-pago",
      provider_payment_id: input.payment.id,
      payment_id: paymentResult.data.id,
      external_reference: input.payment.externalReference,
      starts_at: input.payment.status === "approved" ? paidAt.toISOString() : null,
      expires_at: input.payment.status === "approved" ? accessExpiresAt : null,
      metadata: {
        plan,
        contextId: reference?.contextId,
        requestId: reference?.requestId,
        statusDetail: input.payment.statusDetail
      },
      updated_at: new Date().toISOString()
    },
    { onConflict: "provider,provider_payment_id" }
  );

  if (entitlementResult.error) {
    return {
      persisted: true,
      paymentId: paymentResult.data.id,
      entitlementStatus,
      accessExpiresAt: input.payment.status === "approved" ? accessExpiresAt : undefined,
      reason: entitlementResult.error.message
    };
  }

  await supabase.from("audit_logs").insert({
    actor_type: "provider",
    action: `payment.${input.payment.status}`,
    resource_type: "payment",
    resource_id: paymentResult.data.id,
    idempotency_key: idempotencyKey,
    metadata: {
      provider: "mercado-pago",
      providerPaymentId: input.payment.id,
      entitlementStatus,
      accessExpiresAt: input.payment.status === "approved" ? accessExpiresAt : undefined
    }
  });

  return {
    persisted: true,
    paymentId: paymentResult.data.id,
    entitlementStatus,
    accessExpiresAt: input.payment.status === "approved" ? accessExpiresAt : undefined
  };
}

function readPlanFromMetadata(metadata?: Record<string, unknown>) {
  const value = metadata?.plan;
  return value === "one-time" || value === "pro" ? value : undefined;
}
