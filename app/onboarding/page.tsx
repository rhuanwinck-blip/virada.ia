import { redirect } from "next/navigation";
import { AccessRequired } from "@/components/AccessRequired";
import { OnboardingClient } from "@/components/OnboardingClient";
import { getCurrentUserAccess } from "@/lib/auth-access";
import { reconcileMercadoPagoReturn } from "@/lib/payment-return";

export const dynamic = "force-dynamic";

type OnboardingPageProps = {
  searchParams?: Promise<{
    payment?: string;
    plan?: string;
    payment_id?: string;
    collection_id?: string;
    status?: string;
    collection_status?: string;
    preference_id?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const query = buildPaymentReturnQuery(params);
  const nextPath = `/onboarding${query.toString() ? `?${query.toString()}` : ""}`;
  await reconcileMercadoPagoReturn({
    payment_id: params?.payment_id,
    collection_id: params?.collection_id,
    status: params?.status,
    collection_status: params?.collection_status,
    preference_id: params?.preference_id
  });
  const access = await getCurrentUserAccess({ claimEntitlement: true });

  if (!access.authenticated) {
    const loginUrl = `/login?next=${encodeURIComponent(nextPath)}${params?.payment === "approved" ? "&state=payment-approved" : ""}`;
    redirect(loginUrl);
  }

  if (!access.hasAccess) {
    return <AccessRequired email={access.user?.email} nextPath={nextPath} paymentState={params?.payment} reason={access.reason} />;
  }

  return <OnboardingClient />;
}

function buildPaymentReturnQuery(params: Awaited<OnboardingPageProps["searchParams"]>) {
  const query = new URLSearchParams();
  const keys = ["payment", "plan", "payment_id", "collection_id", "status", "collection_status", "preference_id"] as const;

  for (const key of keys) {
    const value = params?.[key];
    if (value) query.set(key, value);
  }

  return query;
}
