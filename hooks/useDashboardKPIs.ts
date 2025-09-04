import {
  aggregateKPIsByType,
  calculateKPIStats,
  DashboardKPI,
  getDashboardKPIs,
  KPIStats,
} from "@/lib/services/dashboardKPIService";
import { useCallback, useEffect, useState } from "react";

export function useDashboardKPIs() {
  const [kpis, setKpis] = useState<DashboardKPI[]>([]);
  const [aggregatedKpis, setAggregatedKpis] = useState<DashboardKPI[]>([]);
  const [stats, setStats] = useState<KPIStats>({
    totalKPIs: 0,
    improvingKPIs: 0,
    decliningKPIs: 0,
    stableKPIs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction sans useCallback pour éviter les cycles infinis
  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboardKPIs();
      setKpis(data);

      // Agréger par type (garder seulement le plus récent de chaque type)
      const aggregated = aggregateKPIsByType(data);
      setAggregatedKpis(aggregated);

      // Calculer les statistiques
      const kpiStats = calculateKPIStats(data);
      setStats(kpiStats);
    } catch (error) {
      console.error("Error fetching dashboard KPIs:", error);
      setError("Erreur lors du chargement des KPIs");
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(() => {
    fetchKPIs();
  }, []);

  // Effect sans dépendance sur fetchKPIs pour éviter les cycles
  useEffect(() => {
    fetchKPIs();
  }, []);

  // Méthode pour récupérer un KPI spécifique par type
  const getKPIByType = useCallback(
    (type: DashboardKPI["type"]) => {
      return aggregatedKpis.find((kpi) => kpi.type === type);
    },
    [aggregatedKpis]
  );

  // Données de fallback en cas d'absence de données
  const fallbackKPIs: DashboardKPI[] = [
    {
      id: "fallback-conversion",
      type: "conversion",
      label: "Taux de Conversion",
      value: 4.28,
      previousValue: 3.68,
      unit: "%",
      description: "Données de démonstration",
      date: new Date(),
      createdAt: new Date(),
    },
    {
      id: "fallback-bounce",
      type: "bounce",
      label: "Taux de Rebond",
      value: 32.1,
      previousValue: 34.4,
      unit: "%",
      description: "Données de démonstration",
      date: new Date(),
      createdAt: new Date(),
    },
    {
      id: "fallback-scroll",
      type: "scroll",
      label: "Taux de Scroll",
      value: 68.4,
      previousValue: 64.3,
      unit: "%",
      description: "Données de démonstration",
      date: new Date(),
      createdAt: new Date(),
    },
    {
      id: "fallback-engagement",
      type: "engagement",
      label: "Taux d'Engagement",
      value: 52.3,
      previousValue: 49.9,
      unit: "%",
      description: "Données de démonstration",
      date: new Date(),
      createdAt: new Date(),
    },
  ];

  return {
    kpis,
    aggregatedKpis: aggregatedKpis.length > 0 ? aggregatedKpis : fallbackKPIs,
    stats,
    loading,
    error,
    refetch,
    getKPIByType,
    hasData: aggregatedKpis.length > 0,
  };
}
