import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { MoscowPrioritization } from "@/components/backlog/MoscowPrioritization";
import { SprintPlanning } from "@/components/backlog/SprintPlanning";
import { BannerInfo } from "@/components/banner/BannerInfos 2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BacklogPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BannerInfo />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Backlog & Organisation Agile
        </h2>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Backlog Produit</CardTitle>
          </CardHeader>
          <CardContent>
            <KanbanBoard />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintPlanning />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priorisation MoSCoW</CardTitle>
            </CardHeader>
            <CardContent>
              <MoscowPrioritization />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
