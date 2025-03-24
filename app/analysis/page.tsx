import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserResearch } from "@/components/analysis/UserResearch";
import { Wireframes } from "@/components/analysis/Wireframes";
import { Documentation } from "@/components/analysis/Documentation";

export default function AnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Analyse Produit & Wireframes
        </h2>
      </div>

      <Tabs defaultValue="research" className="space-y-4">
        <TabsList>
          <TabsTrigger value="research">Analyse des besoins</TabsTrigger>
          <TabsTrigger value="wireframes">Wireframes</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <UserResearch />
        </TabsContent>

        <TabsContent value="wireframes" className="space-y-4">
          <Wireframes />
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Documentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
