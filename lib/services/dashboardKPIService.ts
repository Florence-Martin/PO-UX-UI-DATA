import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { logger } from "../utils/logger";

export interface DashboardKPI {
  id: string;
  type: "conversion" | "bounce" | "scroll" | "engagement";
  label: string;
  value: number;
  previousValue: number;
  unit: "%";
  description?: string;
  date: Date;
  createdAt: Date;
}

export interface KPIStats {
  totalKPIs: number;
  improvingKPIs: number;
  decliningKPIs: number;
  stableKPIs: number;
}

const collectionName = "dashboardKPIs";

export async function createDashboardKPI(
  data: Omit<DashboardKPI, "id" | "createdAt">
) {
  try {
    const docData = {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
  } catch (error) {
    logger.error("Error creating dashboard KPI:", error);
    throw error;
  }
}

export async function getDashboardKPIs(): Promise<DashboardKPI[]> {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }) as DashboardKPI
    );
  } catch (error) {
    logger.error("Error getting dashboard KPIs:", error);
    return [];
  }
}

export async function deleteDashboardKPI(id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    logger.error("Error deleting dashboard KPI:", error);
    throw error;
  }
}

export function aggregateKPIsByType(kpis: DashboardKPI[]) {
  const kpiMap = new Map<string, DashboardKPI>();

  // Garder seulement le plus récent de chaque type
  kpis.forEach((kpi) => {
    const existing = kpiMap.get(kpi.type);
    if (!existing || kpi.createdAt > existing.createdAt) {
      kpiMap.set(kpi.type, kpi);
    }
  });

  return Array.from(kpiMap.values());
}

export function calculateKPIStats(kpis: DashboardKPI[]): KPIStats {
  const latestKPIs = aggregateKPIsByType(kpis);

  let improving = 0;
  let declining = 0;
  let stable = 0;

  latestKPIs.forEach((kpi) => {
    const change = kpi.value - kpi.previousValue;
    const changePercent =
      kpi.previousValue > 0 ? Math.abs(change / kpi.previousValue) * 100 : 0;

    if (changePercent < 2) {
      stable++;
    } else {
      // Pour le taux de rebond, une diminution est une amélioration
      if (kpi.type === "bounce") {
        change < 0 ? improving++ : declining++;
      } else {
        // Pour les autres KPIs UX, une augmentation est une amélioration
        change > 0 ? improving++ : declining++;
      }
    }
  });

  return {
    totalKPIs: latestKPIs.length,
    improvingKPIs: improving,
    decliningKPIs: declining,
    stableKPIs: stable,
  };
}

export function formatKPIValue(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatKPIChange(
  current: number,
  previous: number,
  type: DashboardKPI["type"]
): {
  text: string;
  isPositive: boolean;
} {
  const change = current - previous;
  const changePercent = Math.abs(change);

  // Pour le taux de rebond, une diminution est positive
  const isPositive = type === "bounce" ? change < 0 : change > 0;

  const sign = change > 0 ? "+" : "";

  return {
    text: `${sign}${changePercent.toFixed(1)}% par rapport au mois dernier`,
    isPositive: Math.abs(change) > 0.1 ? isPositive : true, // Si le changement est minime, on considère comme neutre/positif
  };
}

export function getKPIIcon(type: DashboardKPI["type"]): string {
  const icons = {
    conversion: "🎯",
    bounce: "🔄",
    scroll: "📊",
    engagement: "💫",
  };
  return icons[type] || "📈";
}

export function getKPILabel(type: DashboardKPI["type"]): string {
  const labels = {
    conversion: "Taux de Conversion",
    bounce: "Taux de Rebond",
    scroll: "Taux de Scroll",
    engagement: "Taux d'Engagement",
  };
  return labels[type] || type;
}

export async function generateSampleDashboardKPIs(): Promise<void> {
  const sampleKPIs = [
    {
      type: "conversion" as const,
      value: 4.28,
      previousValue: 3.68,
      unit: "%" as const,
      label: "Taux de Conversion",
      description: "Pourcentage d'utilisateurs qui effectuent une action cible",
      date: new Date(),
    },
    {
      type: "bounce" as const,
      value: 32.1,
      previousValue: 34.4,
      unit: "%" as const,
      label: "Taux de Rebond",
      description:
        "Pourcentage d'utilisateurs qui quittent après une seule page",
      date: new Date(),
    },
    {
      type: "scroll" as const,
      value: 68.4,
      previousValue: 64.3,
      unit: "%" as const,
      label: "Taux de Scroll",
      description: "Pourcentage d'utilisateurs qui scrollent au-delà du fold",
      date: new Date(),
    },
    {
      type: "engagement" as const,
      value: 52.3,
      previousValue: 49.9,
      unit: "%" as const,
      label: "Taux d'Engagement",
      description: "Niveau d'interaction des utilisateurs avec le contenu",
      date: new Date(),
    },
  ];

  try {
    await Promise.all(sampleKPIs.map((kpi) => createDashboardKPI(kpi)));
  } catch (error) {
    logger.error("Error generating sample dashboard KPIs:", error);
    throw error;
  }
}
