import {
  aggregateTimeSeriesData,
  getTimeSeriesMetrics,
  TimeSeriesData,
  TimeSeriesMetric,
} from "@/lib/services/timeSeriesService";
import { useCallback, useEffect, useState } from "react";

export function useTimeSeriesMetrics() {
  const [metrics, setMetrics] = useState<TimeSeriesMetric[]>([]);
  const [aggregatedData, setAggregatedData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction de fetch sans useCallback pour éviter les cycles infinis
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTimeSeriesMetrics();
      setMetrics(data);

      // Agréger les données par période
      const aggregated = aggregateTimeSeriesData(data);
      setAggregatedData(aggregated);
    } catch (error) {
      console.error("Error fetching time series metrics:", error);
      setError("Erreur lors du chargement des métriques temporelles");
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(() => {
    fetchMetrics();
  }, []);

  // Effect sans dépendance sur fetchMetrics pour éviter les cycles
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Données de fallback (les données statiques originales)
  const fallbackData: TimeSeriesData[] = [
    {
      name: "Jan",
      conversion: 3.2,
      bounce: 34.2,
      scroll: 62.1,
      engagement: 45.1,
    },
    {
      name: "Fév",
      conversion: 3.5,
      bounce: 33.1,
      scroll: 63.4,
      engagement: 46.3,
    },
    {
      name: "Mar",
      conversion: 3.8,
      bounce: 31.5,
      scroll: 64.9,
      engagement: 48.2,
    },
    {
      name: "Avr",
      conversion: 4.1,
      bounce: 30.6,
      scroll: 66.2,
      engagement: 50.1,
    },
    {
      name: "Mai",
      conversion: 4.28,
      bounce: 32.1,
      scroll: 68.4,
      engagement: 52.3,
    },
  ];

  return {
    metrics,
    aggregatedData: aggregatedData.length > 0 ? aggregatedData : fallbackData,
    loading,
    error,
    refetch,
    hasData: aggregatedData.length > 0,
  };
}
