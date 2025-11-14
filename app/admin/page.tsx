import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Database,
  GitBranch,
  LineChart,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administration - PO UX/UI Data",
  description:
    "Interface d'administration pour la gestion des données et métriques",
};

interface AdminPage {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  disabled?: boolean;
}

const adminPages: AdminPage[] = [
  {
    title: "KPIs UX Dashboard",
    description:
      "Gérez les 4 KPIs principaux : conversion, rebond, scroll, engagement",
    href: "/admin/dashboard-kpis",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  },
  {
    title: "Données Temporelles",
    description:
      "Administration des graphiques d'évolution historique des KPIs",
    href: "/admin/time-series",
    icon: LineChart,
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  },
  {
    title: "Métriques Utilisateurs",
    description:
      "Administration des données de comportement et répartition device",
    href: "/admin/user-metrics",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  },
  {
    title: "Outils Système",
    description: "Migration sprint, nettoyage badges et maintenance",
    href: "/admin/sprint-migration",
    icon: GitBranch,
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    disabled: true, // Temporairement désactivé pour éviter les suppressions accidentelles
  },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Administration</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Interface d&apos;administration pour la gestion des données,
            métriques UX et configurations système.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {adminPages.map((page) => (
            <Card key={page.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${page.color}`}>
                    <page.icon className="h-5 w-5" />
                  </div>
                  <span>{page.title}</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {page.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {page.disabled ? (
                  <Button
                    disabled
                    className="w-full opacity-50 cursor-not-allowed"
                    title="Temporairement désactivé pour éviter les suppressions accidentelles"
                  >
                    Accéder (Désactivé)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link href={page.href}>
                    <Button className="w-full group">
                      Accéder
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Dashboard UX Dynamique - Étape 1 ✅</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">KPIs UX Implémentés</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🎯 Taux de Conversion (dynamique)</li>
                  <li>🔄 Taux de Rebond (dynamique)</li>
                  <li>📊 Taux de Scroll (dynamique)</li>
                  <li>💫 Taux d&apos;Engagement (dynamique)</li>
                  <li>📱 Répartition Device (dynamique)</li>
                  <li>📈 Graphiques temporels (dynamiques)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Fonctionnalités</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Interface d&apos;administration complète</li>
                  <li>✅ Données temps réel Firebase</li>
                  <li>✅ Génération données test</li>
                  <li>✅ Calculs automatiques tendances</li>
                  <li>✅ Fallback données démonstration</li>
                  <li>✅ Graphiques historiques dynamiques</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accès rapide aux fonctionnalités les plus utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/dashboard-kpis">
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ajouter KPI UX
                </Button>
              </Link>
              <Link href="/admin/time-series">
                <Button variant="outline" size="sm">
                  <LineChart className="mr-2 h-4 w-4" />
                  Données Temporelles
                </Button>
              </Link>
              <Link href="/admin/user-metrics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Nouvelles Métriques
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Voir Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
