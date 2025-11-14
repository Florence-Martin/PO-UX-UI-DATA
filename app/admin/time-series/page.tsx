import { TimeSeriesAdmin } from "@/components/dashboard/TimeSeriesAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration des Données Temporelles - PO UX/UI Data",
  description:
    "Interface d'administration pour gérer les données temporelles des graphiques UX",
};

export default function TimeSeriesAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Administration des Données Temporelles
          </h1>
          <p className="text-muted-foreground">
            Gérez les données historiques qui alimentent les graphiques
            &quot;Vue d&apos;ensemble&quot; du dashboard : évolution des
            métriques UX sur 6 mois.
          </p>
        </div>

        <TimeSeriesAdmin />
      </div>
    </div>
  );
}
