"use client";

import { Suspense } from "react";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { BannerInfo } from "@/components/banner/BannerInfo";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";
import { SprintList } from "@/components/sprint/SprintList";
import SprintHistoryWrapper from "@/components/sprint/sprint-history/SprintHistoryWrapper.";
import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import DefinitionOfDone from "@/components/definition-of-done/DefinitionOfDone";

const tabs = [
  {
    value: "sprints",
    label: "Sprint Planning",
    description:
      "Créer un sprint, sélectionner les User Stories, définir les dates. ✅ But : préparer le sprint à venir.",
    component: <SprintList />,
  },
  {
    value: "dod",
    label: "Definition of Done",
    description:
      "Liste des critères de complétion pour chaque User Story. ✅ But : garantir la qualité et la conformité des livrables.",
    component: <DefinitionOfDone isAdmin={true} />,
  },
  {
    value: "kanban",
    label: "Sprint Backlog",
    description:
      "Exécution technique des tâches liées aux US (todo → done). ✅ But : suivi quotidien des tâches en cours (Daily Scrum).",
    component: <KanbanBoard />,
  },
  {
    value: "board",
    label: "Sprint actif",
    description:
      "Vue synthétique du sprint en cours (US assignées, statut global). ✅ But : vue centrée sur l’état global d’avancement.",
    component: <SprintBoard />,
  },

  {
    value: "metrics",
    label: "Vélocité",
    description:
      "Graphes de vélocité, points réalisés par sprint. ✅ But : mesurer la capacité de l’équipe.",
    component: <SprintVelocity />,
  },
  {
    value: "history",
    label: "Historique",
    description:
      "Sprints passés, rétrospectives, feedbacks. ✅ But : capitalisation & rétrospective.",
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
          description="Visualiser, créer et organiser des sprints Scrum. Suivre l’ensemble des itérations passées, présentes et futures pour assurer un rythme de livraison régulier, une planification agile efficace et une complétion claire des livrables selon la Definition of Done (DoD)."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
