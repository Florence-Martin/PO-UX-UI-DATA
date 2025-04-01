// # Kanban backlog (tasks liées aux user stories)

import { Suspense } from "react";

import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { MoscowPrioritization } from "@/components/backlog/MoscowPrioritization";
import { SprintPlanning } from "@/components/backlog/SprintPlanning";
import { UserStoryList } from "@/components/backlog/UserStoryList";
import { BannerInfo } from "@/components/banner/BannerInfo";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";

const tabs = [
  { value: "kanban", label: "Backlog Kanban", component: <KanbanBoard /> },
  {
    value: "sprints",
    label: "Sprint Planning",
    component: <SprintPlanning />,
  },
  {
    value: "user-stories",
    label: "User Stories",
    component: <UserStoryList />,
  },
  {
    value: "priorisation",
    label: "Priorisation",
    component: <MoscowPrioritization />,
  },
];

export default function BacklogPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Backlog & Organisation Agile"
          description="Gère les tâches du produit, les priorités, les sprints et les user stories pour assurer une livraison itérative."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
