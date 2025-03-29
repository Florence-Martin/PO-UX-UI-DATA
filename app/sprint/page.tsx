// # Vue sprint active (stories sélectionnées, timeline)

import { BannerInfo } from "@/components/banner/BannerInfos 2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SprintTimeline from "@/components/sprint/SprintTimeline";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";

// 💡 Définir les onglets une fois
const tabs = [
  { value: "timeline", label: "Timeline", component: <SprintTimeline /> },
  { value: "board", label: "Sprint Board", component: <SprintBoard /> },
  { value: "metrics", label: "Vélocité", component: <SprintVelocity /> },
];

export default function SprintPage() {
  const tabs = [
    { value: "timeline", label: "Timeline", component: <SprintTimeline /> },
    { value: "board", label: "Sprint Board", component: <SprintBoard /> },
    {
      value: "velocity",
      label: "Vélocité & Burndown",
      component: <SprintVelocity />,
    },
  ];

  return (
    <SectionTabsLayout
      title="Sprint"
      description="Suivi opérationnel du sprint en cours (Scrum)"
      tabs={tabs}
    />
  );
}
