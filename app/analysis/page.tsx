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
      value: "wireframes",
      label: "Wireframes",
      component: <Wireframes />,
    },
    {
      value: "documentation",
      label: "User Stories",
      component: <UserStories />,
    },
  ];

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />
      <SectionTabsLayout
        title="Analyse Produit & Wireframes"
        description="Structure l'analyse UX grâce à des templates interactifs (questionnaire, interview, persona) et un éditeur de user stories connecté à vos wireframes et priorités produit."
        tabs={tabs}
      />
    </div>
  );
}
