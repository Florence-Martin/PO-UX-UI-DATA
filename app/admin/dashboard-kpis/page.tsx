import { DashboardKPIAdmin } from "@/components/dashboard/DashboardKPIAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration des KPIs UX - PO UX/UI Data",
  description: "Interface d'administration pour gérer les KPIs UX du dashboard",
};

export default function DashboardKPIAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Administration des KPIs UX</h1>
          <p className="text-muted-foreground">
            Gérez les métriques UX affichées sur le dashboard principal : taux
            de conversion, rebond, scroll et engagement utilisateur.
          </p>
        </div>

        <DashboardKPIAdmin />
      </div>
    </div>
  );
}
