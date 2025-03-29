// # Kanban backlog (tasks liées aux user stories)

"use client";

import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { MoscowPrioritization } from "@/components/backlog/MoscowPrioritization";
import { SprintPlanning } from "@/components/backlog/SprintPlanning";
import { UserStoryList } from "@/components/backlog/UserStoryList";
// import { PrioritizationBoard } from "@/components/backlog/PrioritizationBoard";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";

export default function BacklogPage() {
  const tabs = [
    { value: "kanban", label: "Backlog Kanban", component: <KanbanBoard /> },
    {
      value: "sprints",
      label: "Planning des Sprints",
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

  return (
    <SectionTabsLayout
      title="Backlog & Organisation Agile"
      description="Gère les tâches du produit, les priorités, les sprints et les user stories pour assurer une livraison itérative."
      tabs={tabs}
    />
  );
}
