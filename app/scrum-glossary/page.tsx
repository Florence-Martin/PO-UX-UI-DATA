// # Kanban backlog (tasks liées aux user stories)

import { Suspense } from "react";

import { BannerInfo } from "@/components/banner/BannerInfo";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import GlossaryTerms from "@/components/scrum/GlossaryTerms";
import ScrumSteps from "@/components/scrum/ScrumSteps";

const tabs = [
  {
    value: "glossary",
    label: "Glossary",
    component: <GlossaryTerms />,
  },
  {
    value: "scrum-process",
    label: "Scrum process",
    component: <ScrumSteps />,
  },
];

export default function ScrumGlossaryPage() {
  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Scrum Glossary & Process"
          description="Glossaire & étapes de la méthodologie avec le framework Scrum pour une compréhension rapide."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
