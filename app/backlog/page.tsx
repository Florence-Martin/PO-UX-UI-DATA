// # Kanban backlog (tasks liées aux user stories)

import { Suspense } from "react";

import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { MoscowPrioritization } from "@/components/backlog/MoscowPrioritization";
import { SprintPlanning } from "@/components/backlog/SprintPlanning";
import { BannerInfo } from "@/components/banner/BannerInfo";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { UserStoriesList } from "@/components/backlog/UserStoryList";

const tabs = [
  {
    value: "user-stories",
    label: "User Stories",
    component: <UserStoriesList />,
  },
  {
    value: "priorisation",
    label: "Priorisation (MoSCoW)",
    component: <MoscowPrioritization />,
  },
  {
    value: "sprints",
    label: "Sprint Planning",
    component: <SprintPlanning />,
  },
  { value: "kanban", label: "Backlog Kanban", component: <KanbanBoard /> },
];

export default function BacklogPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Backlog & Organisation Agile"
          description="De la vision au delivery agile : commence par définir tes user stories (besoin métier), hiérarchise leur valeur avec MoSCoW, planifie les stories à livrer dans le sprint, puis pilote l’avancement des tâches dans ton backlog Kanban."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
