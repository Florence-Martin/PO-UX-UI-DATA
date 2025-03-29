import { UserStories } from "@/components/analysis/UserStories";
import { UserResearch } from "@/components/analysis/UserResearch";
import { Wireframes } from "@/components/analysis/Wireframes";
import { BannerInfo } from "@/components/banner/BannerInfos 2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Roadmap from "@/components/analysis/Roadmap";

// 💡 Définir les onglets une fois
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

export default function AnalysisPage() {
  return (
    <div className="flex-1 space-y-4 px-4 sm:px-6 md:px-8 pt-6">
      <BannerInfo />

      {/* Titre section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Analyse Produit & Wireframes
        </h2>
      </div>

      {/* Onglets dynamiques */}
      <Tabs defaultValue={tabs[0].value} className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 sm:gap-4 mb-9">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
