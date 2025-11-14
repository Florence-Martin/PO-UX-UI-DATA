import { MetricsBannerInfo } from "@/components/banner/MetricsBannerInfo";
import { DeliverableTracking } from "@/components/bi/DeliverableTracking";
import { KpiDocumentation } from "@/components/bi/KpiDocumentation";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { getDeliverables } from "@/lib/services/deliverableService";
import { getDocumentedKPIs } from "@/lib/services/documentedKPIService";
import { Suspense } from "react";

// ISR : Revalide toutes les 60 secondes
// export const revalidate = 60;

// Force le rendu dynamique (désactive le cache pour tester)
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function MetricsPage() {
  // Récupération des données côté serveur
  const [documentedKPIs, deliverables] = await Promise.all([
    getDocumentedKPIs(),
    getDeliverables(),
  ]);

  // Convertir les Timestamp Firebase en objets simples pour éviter les warnings
  const serializedKPIs = documentedKPIs.map((kpi) => ({
    ...kpi,
    createdAt: kpi.createdAt.toDate().toISOString(),
    updatedAt: kpi.updatedAt?.toDate().toISOString(),
  }));

  const serializedDeliverables = deliverables.map((deliverable) => ({
    ...deliverable,
    createdAt: deliverable.createdAt.toDate().toISOString(),
    updatedAt: deliverable.updatedAt?.toDate().toISOString(),
  }));

  const tabs = [
    {
      value: "kpis",
      label: "KPIs Documentés",
      component: <KpiDocumentation kpis={serializedKPIs as any} />,
    },
    {
      value: "deliverables",
      label: "Livrables BI",
      component: (
        <DeliverableTracking deliverables={serializedDeliverables as any} />
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <MetricsBannerInfo />

      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="KPIs & BI Tracking"
          description="Centralise ta documentation de KPIs et assure le suivi des livrables issus des projets Data et Business Intelligence."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
