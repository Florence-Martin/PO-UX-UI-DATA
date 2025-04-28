// # Vue sprint active (stories sélectionnées, timeline)

import { Suspense } from "react";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { BannerInfo } from "@/components/banner/BannerInfo";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";
import SprintTimeline from "@/components/sprint/SprintTimeline";

const tabs = [
  {
    value: "timeline",
    label: "Planning Scrum",
    component: <SprintTimeline />,
  },
  { value: "board", label: "Sprint actif", component: <SprintBoard /> },
  { value: "metrics", label: "Vélocité", component: <SprintVelocity /> },
];

export default function SprintPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Sprint"
          description="Planifie, exécute et mesure les sprints avec une vue complète : Planning Scrum (planning prévisionnel), Sprint actif (vue Kanban du sprint en cours) et suivi de la performance (burndown chart / feedback)."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
