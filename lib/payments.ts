import { isDemoMode } from "@/lib/security";

export type CheckoutInput = {
  plan: "one-time" | "pro";
  email: string;
  diagnosticId?: string;
  contextId?: string;
};

export type CheckoutSession = {
  id: string;
  status: "pending" | "approved" | "in_process";
  provider: "demo" | "mercado-pago";
  checkoutUrl: string;
};

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
  if (isDemoMode() || !process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      id: `demo_${Date.now()}`,
      status: "approved",
      provider: "demo",
      checkoutUrl: `/onboarding?payment=approved&plan=${input.plan}`
    };
  }

  // The real Mercado Pago SDK integration belongs here. The API route keeps
  // release locked until webhook confirmation, never from browser redirects.
  return {
    id: `mp_${Date.now()}`,
    status: "pending",
    provider: "mercado-pago",
    checkoutUrl: "https://www.mercadopago.com.br/developers"
  };
}

export const paymentStates = [
  "pending",
  "approved",
  "in_process",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back"
] as const;
