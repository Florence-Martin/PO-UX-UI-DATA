// hooks/usePersonas.ts
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export type Persona = {
  id: string;
  title: string;
  content: string;
};

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "user_research_personas"));
      const list = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Persona)
      );
      setPersonas(list);
    } catch (error) {
      console.error("Erreur lors du chargement des personas:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePersona = async (id: string, data: Omit<Persona, "id">) => {
    await setDoc(doc(db, "user_research_personas", id), { ...data });
    fetchPersonas(); // refresh
  };

  const deletePersona = async (id: string) => {
    await deleteDoc(doc(db, "user_research_personas", id));
    fetchPersonas();
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return { personas, loading, savePersona, deletePersona };
}
