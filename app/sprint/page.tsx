// # Vue sprint active (stories sélectionnées, timeline)

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SprintTimeline from "@/components/sprint/SprintTimeline";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";
import { BannerInfo } from "@/components/banner/BannerInfo";

const tabs = [
  {
    value: "timeline",
    label: "Sprint Timeline",
    component: <SprintTimeline />,
  },
  { value: "board", label: "Sprint Board", component: <SprintBoard /> },
  { value: "metrics", label: "Vélocité", component: <SprintVelocity /> },
];

export default function SprintPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <SectionTabsLayout
        title="Sprint"
        description="Planifie, exécute et mesure les sprints avec une vue complète : timeline Scrum, tableau d’avancement des tâches et indicateurs de vélocité."
        tabs={tabs}
      />
    </div>
  );
}
