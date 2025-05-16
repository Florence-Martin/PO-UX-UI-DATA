// # Kanban backlog (tasks liées aux user stories)

import { Suspense } from "react";

import { MoscowPrioritization } from "@/components/prioritization/MoscowPrioritization";
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
];

export default function BacklogPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Backlog & Organisation Agile"
          description="De la vision au delivery agile : commence par définir tes User Stories (besoins métier), hiérarchise leur valeur avec la méthode MoSCoW, planifie celles à livrer dans un sprint, puis associe les tâches techniques dans le Sprint Backlog.
Le Product Backlog centralise les besoins métier, leur priorisation, et prépare leur exécution."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
