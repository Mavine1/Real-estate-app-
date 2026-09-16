import RoleDashboard from "@/components/management/RoleDashboard";
import CaretakerDashboard from "@/components/caretaker/CaretakerDashboard";
import TenantDashboard from "@/components/tenant/TenantDashboard";
import { useGlobalContext } from "@/lib/global-provider";

export default function Home() {
  const { user } = useGlobalContext();

  if (user?.role === "tenant") return <TenantDashboard />;
  if (user?.role === "caretaker") return <CaretakerDashboard />;
  return <RoleDashboard />;
}
