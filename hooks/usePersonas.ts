// hooks/usePersonas.ts
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Persona = {
  id: string;
  title: string;
  content: string;
};

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonas = async () => {
    const snapshot = await getDocs(collection(db, "user_research_personas"));
    const list = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Persona)
    );
    setPersonas(list);
    setLoading(false);
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
