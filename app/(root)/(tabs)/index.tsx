import RoleDashboard from "@/components/management/RoleDashboard";
import TenantDashboard from "@/components/tenant/TenantDashboard";
import { useGlobalContext } from "@/lib/global-provider";

export default function Home() {
  const { user } = useGlobalContext();

  return user?.role === "tenant" ? <TenantDashboard /> : <RoleDashboard />;
}

