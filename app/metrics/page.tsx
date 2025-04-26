"use client";

import { Suspense } from "react";
import { BannerInfo } from "@/components/banner/BannerInfo";
import { KpiDocumentation } from "@/components/bi/KpiDocumentation";
import { DeliverableTracking } from "@/components/bi/DeliverableTracking";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { MetricsBannerInfo } from "@/components/banner/MetricsBannerInfo";

export default function Metrics() {
  const tabs = [
    {
      value: "kpis",
      label: "KPIs Documentés",
      component: <KpiDocumentation />,
    },
    {
      value: "deliverables",
      label: "Livrables BI",
      component: <DeliverableTracking />,
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
