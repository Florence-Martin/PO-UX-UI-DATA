import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

// Type TypeScript du scénario
export type Scenario = {
  id: string;
  title: string;
  context: string;
  objective: string;
  expectedInsights: string[];
  associatedPersonaId: string;
  targetKPI: string;
  testedComponents: string[];
  painPointsObserved: string[];
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/**
 * Crée un nouveau scénario dans Firestore
 */
export async function createScenario(
  data: Omit<Scenario, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = `scenario_${Date.now()}`;
  const ref = doc(db, "user_research_scenarios", id);
  await setDoc(ref, {
    id,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

/**
 * Récupère tous les scénarios de la collection
 */
export async function getAllScenarios(): Promise<Scenario[]> {
  const ref = collection(db, "user_research_scenarios");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => doc.data() as Scenario);
}

/**
 * Récupère un scénario par ID
 */
export async function getScenario(id: string): Promise<Scenario | null> {
  const ref = doc(db, "user_research_scenarios", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Scenario;
}

/**
 * Sauvegarde un scénario
 */
export async function saveScenario(
  id: string,
  data: Omit<Scenario, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const ref = doc(db, "user_research_scenarios", id);
  await setDoc(
    ref,
    {
      id,
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Supprime un scénario par ID
 */
export async function deleteScenario(id: string): Promise<void> {
  const ref = doc(db, "user_research_scenarios", id);
  await deleteDoc(ref);
}
