import { UserMetricsAdmin } from "@/components/dashboard/UserMetricsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration des Métriques Utilisateurs - PO UX/UI Data",
  description:
    "Interface d'administration pour gérer les métriques de comportement utilisateur",
};

export default function UserMetricsAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Administration des Métriques Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les données de comportement utilisateur et la répartition des
            devices (Mobile, Tablet, Desktop) affichées dans le dashboard.
          </p>
        </div>

        <UserMetricsAdmin />
      </div>
    </div>
  );
}
