import { redirect } from "next/navigation";
import { AccessRequired } from "@/components/AccessRequired";
import { OnboardingClient } from "@/components/OnboardingClient";
import { getCurrentUserAccess } from "@/lib/auth-access";

export const dynamic = "force-dynamic";

type OnboardingPageProps = {
  searchParams?: Promise<{ payment?: string; plan?: string }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params?.payment) query.set("payment", params.payment);
  if (params?.plan) query.set("plan", params.plan);
  const nextPath = `/onboarding${query.toString() ? `?${query.toString()}` : ""}`;
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
