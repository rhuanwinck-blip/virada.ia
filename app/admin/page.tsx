import { AdminPanel } from "@/components/AdminPanel";
import { buildProductionReadinessReport } from "@/lib/production-readiness";

export default function AdminPage() {
  return <AdminPanel readiness={buildProductionReadinessReport()} />;
}
