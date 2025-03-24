import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiDocumentation } from "../../components/bi/KpiDocumentation";
import { DatasetExplorer } from "../../components/bi/DatasetExplorer";
import { DeliverableTracking } from "../../components/bi/DeliverableTracking";

export default function BiPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Collaboration BI</h2>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Documentation des KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <KpiDocumentation />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Explorateur de Données</CardTitle>
            </CardHeader>
            <CardContent>
              <DatasetExplorer />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suivi des Livrables</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliverableTracking />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
