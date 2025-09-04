"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// ——— Types ———
export type UserMetricType =
  | "sessions"
  | "pageViews"
  | "avgDuration"
  | "bounceRate";
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface UserMetric {
  id: string;
  type: UserMetricType;
  value: number;
  device: DeviceType;
  description?: string | null;
  // peut venir de Firestore (Timestamp) ou d'une string ISO; on normalise ensuite
  date: any;
}

// ——— Service (lecture) ———
// Assure-toi d’avoir cette fonction dans:  "@/lib/services/userMetricsService"
// export async function getUserMetrics(): Promise<UserMetric[]> { ... }
import { getUserMetrics } from "@/lib/services/userMetricsService";

interface DeviceDistribution {
  mobile: number;
  tablet: number;
  desktop: number;
}

export function useUserMetrics() {
  const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserMetrics();
      // normalisation date -> Date
      const normalized = data.map((m) => ({
        ...m,
        date: normalizeDate(m.date),
      }));
      // tri du plus récent au plus ancien (utile pour l’affichage)
      normalized.sort(
        (a, b) => (b.date as Date).getTime() - (a.date as Date).getTime()
      );
      setUserMetrics(normalized);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Chargement initial
    refetch();
  }, [refetch]);

  const deviceData: DeviceDistribution = useMemo(() => {
    if (!userMetrics || userMetrics.length === 0)
      return { mobile: 0, tablet: 0, desktop: 0 };

    const counts = { mobile: 0, tablet: 0, desktop: 0 } as Record<
      DeviceType,
      number
    >;
    for (const m of userMetrics) {
      if (
        m.device === "mobile" ||
        m.device === "tablet" ||
        m.device === "desktop"
      ) {
        counts[m.device] += 1;
      }
    }
    const total = userMetrics.length || 1;
    return {
      mobile: (counts.mobile / total) * 100,
      tablet: (counts.tablet / total) * 100,
      desktop: (counts.desktop / total) * 100,
    };
  }, [userMetrics]);

  const hasData = userMetrics.length > 0;

  return {
    userMetrics,
    deviceData,
    loading,
    error,
    refetch,
    hasData,
  };
}

// ——— Helpers ———
function normalizeDate(raw: unknown): Date {
  // Firestore Timestamp ?
  // @ts-ignore
  if (
    raw &&
    typeof raw === "object" &&
    typeof (raw as any).toDate === "function"
  ) {
    // @ts-ignore
    return (raw as any).toDate();
  }
  if (typeof raw === "string") return new Date(raw);
  if (raw instanceof Date) return raw;
  // fallback: maintenant
  return new Date();
}
