import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccessRequired } from "@/components/AccessRequired";
import { DashboardClient } from "@/components/DashboardClient";
import DashboardLoading from "@/app/dashboard/loading";
import { getCurrentUserAccess } from "@/lib/auth-access";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const access = await getCurrentUserAccess({ claimEntitlement: true });

  if (!access.authenticated) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
  }

  if (!access.hasAccess) {
    return <AccessRequired email={access.user?.email} nextPath="/dashboard" reason={access.reason} />;
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
