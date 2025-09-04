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

export interface UserMetric {
  id: string;
  type: "sessions" | "pageViews" | "avgDuration" | "bounceRate";
  value: number;
  device: "mobile" | "tablet" | "desktop";
  description?: string;
  date: Date;
  createdAt: Date;
}

export interface DeviceData {
  mobile: number;
  tablet: number;
  desktop: number;
}

const collectionName = "userMetrics";

export async function createUserMetric(
  data: Omit<UserMetric, "id" | "createdAt">
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
    console.error("Error creating user metric:", error);
    throw error;
  }
}

export async function getUserMetrics(): Promise<UserMetric[]> {
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
        } as UserMetric)
    );
  } catch (error) {
    console.error("Error getting user metrics:", error);
    return [];
  }
}

export async function deleteUserMetric(id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Error deleting user metric:", error);
    throw error;
  }
}

export function aggregateDeviceData(metrics: UserMetric[]): DeviceData {
  if (metrics.length === 0) {
    return { mobile: 45.2, tablet: 23.1, desktop: 31.7 }; // Fallback
  }

  // Compter les occurrences par device
  const deviceCounts = metrics.reduce((acc, metric) => {
    acc[metric.device] = (acc[metric.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = metrics.length;

  return {
    mobile: ((deviceCounts.mobile || 0) / total) * 100,
    tablet: ((deviceCounts.tablet || 0) / total) * 100,
    desktop: ((deviceCounts.desktop || 0) / total) * 100,
  };
}

export async function generateSampleUserMetrics(): Promise<void> {
  const sampleMetrics = [
    // Sessions
    {
      type: "sessions",
      value: 1250,
      device: "mobile",
      description: "Sessions mobiles",
    },
    {
      type: "sessions",
      value: 830,
      device: "tablet",
      description: "Sessions tablettes",
    },
    {
      type: "sessions",
      value: 1420,
      device: "desktop",
      description: "Sessions desktop",
    },

    // Pages vues
    {
      type: "pageViews",
      value: 4200,
      device: "mobile",
      description: "Pages vues mobiles",
    },
    {
      type: "pageViews",
      value: 2100,
      device: "tablet",
      description: "Pages vues tablettes",
    },
    {
      type: "pageViews",
      value: 5800,
      device: "desktop",
      description: "Pages vues desktop",
    },

    // Durée moyenne (en minutes)
    {
      type: "avgDuration",
      value: 2.3,
      device: "mobile",
      description: "Durée moyenne mobile",
    },
    {
      type: "avgDuration",
      value: 3.1,
      device: "tablet",
      description: "Durée moyenne tablette",
    },
    {
      type: "avgDuration",
      value: 4.2,
      device: "desktop",
      description: "Durée moyenne desktop",
    },

    // Taux de rebond
    {
      type: "bounceRate",
      value: 45.2,
      device: "mobile",
      description: "Rebond mobile",
    },
    {
      type: "bounceRate",
      value: 38.7,
      device: "tablet",
      description: "Rebond tablette",
    },
    {
      type: "bounceRate",
      value: 32.1,
      device: "desktop",
      description: "Rebond desktop",
    },

    // Métriques supplémentaires pour plus de données
    { type: "sessions", value: 980, device: "mobile" },
    { type: "sessions", value: 720, device: "tablet" },
    { type: "sessions", value: 1150, device: "desktop" },
    { type: "pageViews", value: 3800, device: "mobile" },
    { type: "pageViews", value: 1950, device: "tablet" },
    { type: "pageViews", value: 5200, device: "desktop" },
    { type: "avgDuration", value: 2.1, device: "mobile" },
    { type: "avgDuration", value: 2.9, device: "tablet" },
    { type: "avgDuration", value: 3.8, device: "desktop" },
  ];

  try {
    await Promise.all(
      sampleMetrics.map((metric) =>
        createUserMetric({
          type: metric.type as UserMetric["type"],
          value: metric.value,
          device: metric.device as UserMetric["device"],
          description: metric.description,
          date: new Date(),
        })
      )
    );
  } catch (error) {
    console.error("Error generating sample user metrics:", error);
    throw error;
  }
}
