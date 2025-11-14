"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import {
  formatKPIChange,
  formatKPIValue,
  getKPIIcon,
} from "@/lib/services/dashboardKPIService";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

export function DashboardKPICards() {
  const { aggregatedKpis, loading, error, hasData } = useDashboardKPIs();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Erreur lors du chargement des KPIs.{" "}
              {!hasData && "Utilisation des données de démonstration."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ordre d'affichage des KPIs
  const kpiOrder: Array<"conversion" | "bounce" | "scroll" | "engagement"> = [
    "conversion",
    "bounce",
    "scroll",
    "engagement",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiOrder.map((type) => {
        const kpi = aggregatedKpis.find((k) => k.type === type);

        if (!kpi) {
          return (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {type === "conversion" && "Taux de Conversion"}
                  {type === "bounce" && "Taux de Rebond"}
                  {type === "scroll" && "Taux de Scroll"}
                  {type === "engagement" && "Taux d'Engagement"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">
                  --
                </div>
                <p className="text-xs text-muted-foreground">Aucune donnée</p>
              </CardContent>
            </Card>
          );
        }

        const changeInfo = formatKPIChange(
          kpi.value,
          kpi.previousValue,
          kpi.type
        );
        const change = kpi.value - kpi.previousValue;
        const hasChange = Math.abs(change) > 0.1;

        return (
          <Card key={kpi.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span className="text-lg">{getKPIIcon(kpi.type)}</span>
                {kpi.label}
              </CardTitle>
              {hasChange && (
                <div
                  className={`flex items-center ${
                    changeInfo.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {changeInfo.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              )}
              {!hasChange && (
                <div className="flex items-center text-gray-500">
                  <Minus className="h-4 w-4" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatKPIValue(kpi.value)}
              </div>
              <p
                className={`text-xs ${
                  changeInfo.isPositive
                    ? "text-green-600"
                    : hasChange
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {changeInfo.text}
              </p>
              {kpi.description && !hasData && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {kpi.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
