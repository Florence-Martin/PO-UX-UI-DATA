"use client";

import { Suspense } from "react";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { BannerInfo } from "@/components/banner/BannerInfo";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { SprintVelocity } from "@/components/sprint/SprintVelocity";
import SprintPlanningTimeline from "@/components/sprint/SprintPlanningTimeline";
import { SprintList } from "@/components/sprint/SprintList";
import SprintHistoryWrapper from "@/components/sprint/sprint-history/SprintHistoryWrapper.";
import { KanbanBoard } from "@/components/backlog/KanbanBoard";

const tabs = [
  {
    value: "sprints",
    label: "Sprint Planning",
    description:
      "Créer un sprint, sélectionner les User Stories, définir les dates. ✅ But : préparer le sprint à venir.",
    component: <SprintList />,
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
    value: "timeline",
    label: "Planning Scrum",
    description:
      "Timeline visuelle par section (Planifié, Exécution, Review). ✅ But : représentation globale des US dans le temps.",
    component: <SprintPlanningTimeline />,
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
