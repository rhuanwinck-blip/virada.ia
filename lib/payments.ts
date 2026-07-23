import { createRequestId, getRuntimeEnv, isDemoMode } from "@/lib/security";

export type CheckoutInput = {
  plan: "one-time" | "pro";
  email?: string;
  diagnosticId?: string;
  contextId?: string;
};

export type CheckoutSession = {
  id: string;
  status: "pending" | "approved" | "in_process";
  provider: "demo" | "mercado-pago";
  checkoutUrl: string;
};

export const paymentStates = [
  "pending",
  "approved",
  "in_process",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back"
] as const;

export type PaymentState = (typeof paymentStates)[number];

export type MercadoPagoPayment = {
  id: string;
  status: PaymentState | "unknown";
  externalReference?: string;
  rawStatus?: string;
  statusDetail?: string;
  email?: string;
  transactionAmount?: number;
  currencyId?: string;
  dateApproved?: string;
  metadata?: Record<string, unknown>;
};

const checkoutPlans = {
  "one-time": {
    id: "virada-30",
    title: "Plano da Virada 30",
    description: "Analise completa, plano de 30 dias, rotinas, checklists e PDF.",
    unitPrice: 47
  },
  pro: {
    id: "virada-pro",
    title: "Virada Pro",
    description: "Primeiro mes do assessor proativo com check-ins e replanejamento.",
    unitPrice: 59.9
  }
} as const;

function getAppUrl() {
  const env = getRuntimeEnv();
  const configuredUrl = env.NEXT_PUBLIC_APP_URL?.trim();
  return (configuredUrl || "https://virada-ia.vercel.app").replace(/\/$/, "");
}

function isPaymentState(status: string | undefined): status is PaymentState {
  return !!status && (paymentStates as readonly string[]).includes(status);
}

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
  const env = getRuntimeEnv();
  if (isDemoMode() || !env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      id: `demo_${Date.now()}`,
      status: "approved",
      provider: "demo",
      checkoutUrl: `/onboarding?payment=approved&plan=${input.plan}`
    };
  }

  const appUrl = getAppUrl();
  const plan = checkoutPlans[input.plan];
  const reference = [
    input.plan,
    input.diagnosticId || input.contextId || "direct",
    createRequestId()
  ].join(":");

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": createRequestId()
    },
    body: JSON.stringify({
      items: [
        {
          id: plan.id,
          title: plan.title,
          description: plan.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: plan.unitPrice
        }
      ],
      payer: input.email ? { email: input.email } : undefined,
      back_urls: {
        success: `${appUrl}/onboarding?payment=approved&plan=${input.plan}`,
        failure: `${appUrl}/checkout?payment=failure&plan=${input.plan}`,
        pending: `${appUrl}/checkout?payment=pending&plan=${input.plan}`
      },
      notification_url: `${appUrl}/api/payments/webhook`,
      auto_return: "approved",
      external_reference: reference,
      statement_descriptor: "VIRADA IA",
      metadata: {
        plan: input.plan,
        diagnostic_id: input.diagnosticId,
        context_id: input.contextId
      }
    })
  });
  const preference = (await response.json().catch(() => ({}))) as {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
    message?: string;
  };

  if (!response.ok || !preference.id || !(preference.init_point || preference.sandbox_init_point)) {
    throw new Error(`mercado_pago_preference_failed:${response.status}:${preference.message ?? "unknown"}`);
  }

  return {
    id: preference.id,
    status: "pending",
    provider: "mercado-pago",
    checkoutUrl: preference.init_point || preference.sandbox_init_point!
  };
}

export async function fetchMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment> {
  const env = getRuntimeEnv();
  if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("missing_mercado_pago_access_token");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`
    }
  });
  const payment = (await response.json().catch(() => ({}))) as {
    id?: string | number;
    status?: string;
    status_detail?: string;
    external_reference?: string;
    transaction_amount?: number;
    currency_id?: string;
    date_approved?: string;
    metadata?: Record<string, unknown>;
    payer?: {
      email?: string;
    };
    message?: string;
  };

  if (!response.ok || payment.id == null) {
    throw new Error(`mercado_pago_payment_fetch_failed:${response.status}:${payment.message ?? "unknown"}`);
  }

  return {
    id: String(payment.id),
    status: isPaymentState(payment.status) ? payment.status : "unknown",
    externalReference: payment.external_reference,
    rawStatus: payment.status,
    statusDetail: payment.status_detail,
    email: payment.payer?.email,
    transactionAmount: payment.transaction_amount,
    currencyId: payment.currency_id,
    dateApproved: payment.date_approved,
    metadata: payment.metadata
  };
}
