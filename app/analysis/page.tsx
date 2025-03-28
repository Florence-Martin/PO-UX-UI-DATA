import { UserStories } from "@/components/analysis/UserStories";
import { UserResearch } from "@/components/analysis/UserResearch";
import { Wireframes } from "@/components/analysis/Wireframes";
import { BannerInfo } from "@/components/banner/BannerInfos 2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      {/* Onglets */}
      <Tabs defaultValue="research" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 sm:gap-4 mb-9">
          <TabsTrigger value="research">Analyse des besoins</TabsTrigger>
          <TabsTrigger value="wireframes">Wireframes</TabsTrigger>
          <TabsTrigger value="documentation">User stories</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <UserResearch />
        </TabsContent>

        <TabsContent value="wireframes" className="space-y-4">
          <Wireframes />
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <UserStories />
        </TabsContent>
      </Tabs>
    </div>
  );
}
