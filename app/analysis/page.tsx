import { Suspense } from "react";
import { UserStories } from "@/components/analysis/UserStories";
import { UserResearch } from "@/components/analysis/UserResearch";
import { Wireframes } from "@/components/analysis/Wireframes";
import Roadmap from "@/components/analysis/Roadmap";
import { BannerInfo } from "@/components/banner/BannerInfo";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";

export default function AnalysisPage() {
  const tabs = [
    {
      value: "roadmap",
      label: "Roadmap",
      component: <Roadmap />,
    },
    {
      value: "research",
      label: "Analyse des besoins",
      component: <UserResearch />,
    },
    {
      value: "documentation",
      label: "Editeur US",
      component: <UserStories />,
    },
    {
      value: "wireframes",
      label: "Wireframes",
      component: <Wireframes />,
    },
  ];

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />

      <Suspense fallback={<p>Loading tabs...</p>}>
        <SectionTabsLayout
          title="Analyse Produit & Wireframes"
          description="Structure ton cadrage produit UX étape par étape : définis ta roadmap, explore les besoins utilisateurs, rédige tes user stories à partir des insights, puis visualise tes idées à travers des wireframes connectés."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
