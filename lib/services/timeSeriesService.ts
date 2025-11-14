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

export interface TimeSeriesMetric {
  id: string;
  type: "conversion" | "bounce" | "scroll" | "engagement";
  label: string;
  value: number;
  period: string; // "2024-01", "2024-02", etc.
  date: Date;
  createdAt: Date;
}

export interface TimeSeriesData {
  name: string;
  conversion: number;
  bounce: number;
  scroll: number;
  engagement: number;
}

const collectionName = "timeSeriesMetrics";

export async function createTimeSeriesMetric(
  data: Omit<TimeSeriesMetric, "id" | "createdAt">
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
    console.error("Error creating time series metric:", error);
    throw error;
  }
}

export async function getTimeSeriesMetrics(): Promise<TimeSeriesMetric[]> {
  try {
    const q = query(collection(db, collectionName), orderBy("period", "asc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate(),
        }) as TimeSeriesMetric
    );
  } catch (error) {
    console.error("Error getting time series metrics:", error);
    return [];
  }
}

export async function deleteTimeSeriesMetric(id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Error deleting time series metric:", error);
    throw error;
  }
}

export function aggregateTimeSeriesData(
  metrics: TimeSeriesMetric[]
): TimeSeriesData[] {
  const periodMap = new Map<string, Partial<TimeSeriesData>>();

  metrics.forEach((metric) => {
    if (!periodMap.has(metric.period)) {
      periodMap.set(metric.period, { name: formatPeriod(metric.period) });
    }

    const existing = periodMap.get(metric.period)!;
    existing[metric.type] = metric.value;
  });

  return Array.from(periodMap.values())
    .filter(
      (item) =>
        item.conversion !== undefined &&
        item.bounce !== undefined &&
        item.scroll !== undefined &&
        item.engagement !== undefined
    )
    .map((item) => item as TimeSeriesData);
}

function formatPeriod(period: string): string {
  const [year, month] = period.split("-");
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  return months[parseInt(month) - 1] || month;
}

export async function generateSampleTimeSeriesData(): Promise<void> {
  const sampleData = [
    // Janvier 2024
    { type: "conversion", value: 3.2, period: "2024-01" },
    { type: "bounce", value: 34.2, period: "2024-01" },
    { type: "scroll", value: 62.1, period: "2024-01" },
    { type: "engagement", value: 45.1, period: "2024-01" },

    // Février 2024
    { type: "conversion", value: 3.5, period: "2024-02" },
    { type: "bounce", value: 33.1, period: "2024-02" },
    { type: "scroll", value: 63.4, period: "2024-02" },
    { type: "engagement", value: 46.3, period: "2024-02" },

    // Mars 2024
    { type: "conversion", value: 3.8, period: "2024-03" },
    { type: "bounce", value: 31.5, period: "2024-03" },
    { type: "scroll", value: 64.9, period: "2024-03" },
    { type: "engagement", value: 48.2, period: "2024-03" },

    // Avril 2024
    { type: "conversion", value: 4.1, period: "2024-04" },
    { type: "bounce", value: 30.6, period: "2024-04" },
    { type: "scroll", value: 66.2, period: "2024-04" },
    { type: "engagement", value: 50.1, period: "2024-04" },

    // Mai 2024
    { type: "conversion", value: 4.28, period: "2024-05" },
    { type: "bounce", value: 32.1, period: "2024-05" },
    { type: "scroll", value: 68.4, period: "2024-05" },
    { type: "engagement", value: 52.3, period: "2024-05" },

    // Juin 2024
    { type: "conversion", value: 4.45, period: "2024-06" },
    { type: "bounce", value: 31.8, period: "2024-06" },
    { type: "scroll", value: 69.1, period: "2024-06" },
    { type: "engagement", value: 53.7, period: "2024-06" },
  ];

  try {
    await Promise.all(
      sampleData.map((data) =>
        createTimeSeriesMetric({
          type: data.type as "conversion" | "bounce" | "scroll" | "engagement",
          label: getTypeLabel(data.type),
          value: data.value,
          period: data.period,
          date: new Date(),
        })
      )
    );
  } catch (error) {
    console.error("Error generating sample time series data:", error);
    throw error;
  }
}

function getTypeLabel(type: string): string {
  const labels = {
    conversion: "Taux de Conversion",
    bounce: "Taux de Rebond",
    scroll: "Taux de Scroll",
    engagement: "Taux d'Engagement",
  };
  return labels[type as keyof typeof labels] || type;
}
