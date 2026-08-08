import { logEvent } from "@/lib/logger";
import { fetchMercadoPagoPayment, type PaymentState } from "@/lib/payments";
import { upsertPaymentAccess, type PaymentAccessPersistenceResult } from "@/lib/payment-store";
import { getRuntimeEnv } from "@/lib/security";

type SearchParamValue = string | string[] | undefined;

export type MercadoPagoReturnParams = {
  payment_id?: SearchParamValue;
  collection_id?: SearchParamValue;
  status?: SearchParamValue;
  collection_status?: SearchParamValue;
  preference_id?: SearchParamValue;
};

export type PaymentReturnReconciliation = {
  checked: boolean;
  accessReleased: boolean;
  paymentId?: string;
  status?: PaymentState | "unknown";
  persistence?: PaymentAccessPersistenceResult;
  reason?: string;
};

export function getMercadoPagoReturnPaymentId(params: MercadoPagoReturnParams) {
  return firstMeaningfulParam(params.payment_id) ?? firstMeaningfulParam(params.collection_id);
}

export async function reconcileMercadoPagoReturn(
  params: MercadoPagoReturnParams
): Promise<PaymentReturnReconciliation> {
  const paymentId = getMercadoPagoReturnPaymentId(params);
  if (!paymentId) {
    return { checked: false, accessReleased: false, reason: "missing_payment_id" };
  }

  const env = getRuntimeEnv();
  if (env.DEMO_MODE !== "false" || !env.MERCADO_PAGO_ACCESS_TOKEN) {
    return { checked: false, accessReleased: false, paymentId, reason: "payment_lookup_disabled" };
  }

  try {
    const payment = await fetchMercadoPagoPayment(paymentId);
    const persistence = await upsertPaymentAccess({
      payment,
      rawEvent: {
        source: "mercado_pago_return",
        paymentId,
        preferenceId: firstMeaningfulParam(params.preference_id),
        reportedStatus: firstMeaningfulParam(params.status),
        reportedCollectionStatus: firstMeaningfulParam(params.collection_status)
      }
    });

    logEvent("info", "payment_return_reconciled", {
      paymentId: payment.id,
      status: payment.status,
      persisted: persistence.persisted,
      persistenceReason: persistence.reason,
      accessReleased: payment.status === "approved"
    });

    return {
      checked: true,
      accessReleased: payment.status === "approved",
      paymentId: payment.id,
      status: payment.status,
      persistence
    };
  } catch (error) {
    logEvent("error", "payment_return_reconcile_failed", {
      paymentId,
      error: error instanceof Error ? error.message : String(error)
    });

    return {
      checked: true,
      accessReleased: false,
      paymentId,
      reason: "payment_lookup_failed"
    };
  }
}

function firstMeaningfulParam(value: SearchParamValue) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate?.trim();
  if (!normalized || normalized === "null" || normalized === "undefined") return undefined;
  return normalized;
}
