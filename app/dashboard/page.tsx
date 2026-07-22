import { Suspense } from "react";
import { DashboardClient } from "@/components/DashboardClient";
import DashboardLoading from "@/app/dashboard/loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
