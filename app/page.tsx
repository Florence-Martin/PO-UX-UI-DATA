import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UserMetrics } from "@/components/dashboard/UserMetrics";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard UX/Data</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.28%</div>
            <p className="text-xs text-muted-foreground">
              +0.6% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Rebond
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.1%</div>
            <p className="text-xs text-muted-foreground">
              -2.3% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Scroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">
              +4.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d&apos;Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52.3%</div>
            <p className="text-xs text-muted-foreground">
              +2.4% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vue d&apos;ensemble</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* <Overview /> */}
            <MetricsGrid />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Métriques Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <UserMetrics />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
