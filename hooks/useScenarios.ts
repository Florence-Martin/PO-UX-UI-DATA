// hooks/useScenarios.ts
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Scenario = {
  id: string;
  title: string;
  content: string;
};

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = async () => {
    const snapshot = await getDocs(collection(db, "user_research_scenarios"));
    const list = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Scenario
    );
    setScenarios(list);
    setLoading(false);
  };

  const saveScenario = async (id: string, data: Omit<Scenario, "id">) => {
    await setDoc(doc(db, "user_research_scenarios", id), { ...data });
    fetchScenarios(); // refresh
  };

  const deleteScenario = async (id: string) => {
    await deleteDoc(doc(db, "user_research_scenarios", id));
    fetchScenarios();
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  return { scenarios, loading, saveScenario, deleteScenario };
}
