import BacklogGoal from "@/components/analysis/BacklogGoal";
import { RoadmapFlow } from "@/components/analysis/RoadmapFlow";
import { DashboardBannerInfo } from "@/components/banner/DashboardBannerInfo";
import { DashboardKPICards } from "@/components/dashboard/DashboardKPICards";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UserMetrics } from "@/components/dashboard/UserMetrics";
import { GDPRBanner } from "@/components/GDPRBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
// import { Overview } from "@/components/dashboard/overview";

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardBannerInfo />
      <GDPRBanner />
      <div className="flex items-center space-y-2">
        <Image
          src="/favicon-white-48x48.png"
          alt="Logo"
          className="rounded-full mr-3"
          width={48}
          height={48}
        />
        <h1 className="text-2xl font-bold mr-2">Dashboard</h1>
      </div>
      <BacklogGoal />
      <RoadmapFlow />

      {/* KPIs Dynamiques */}
      <DashboardKPICards />

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
