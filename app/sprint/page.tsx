import { Suspense } from "react";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { BannerInfo } from "@/components/banner/BannerInfo";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";
import SprintPlanningTimeline from "@/components/sprint/SprintPlanningTimeline";
import { SprintList } from "@/components/sprint/SprintList";
import SprintHistoryWrapper from "@/components/sprint/sprint-history/SprintHistoryWrapper.";

const tabs = [
  {
    value: "sprints",
    label: "Sprint Planning",
    component: <SprintList />,
  },
  {
    value: "timeline",
    label: "Planning Scrum",
    component: <SprintPlanningTimeline />,
  },
  { value: "board", label: "Sprint actif", component: <SprintBoard /> },

  { value: "metrics", label: "Vélocité", component: <SprintVelocity /> },
  {
    value: "history",
    label: "Historique",
    component: <SprintHistoryWrapper />,
  },
];

export default function SprintPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Gestion des Sprints"
          description=" Visualiser, créer et organiser des sprints Scrum. Suivre l’ensemble des itérations passées, présentes et futures pour assurer un rythme de livraison régulier et une planification agile.
"
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
