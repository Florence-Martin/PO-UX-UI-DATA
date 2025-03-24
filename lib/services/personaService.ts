import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// Type TypeScript du persona
export type Persona = {
  id: string;
  name: string;
  role: string;
  company: string;
  goals: string;
  pains: string;
  needs: string;
  channels: string;
};

/**
 * Crée un nouveau persona dans Firestore
 */
export async function createPersona(
  data: Omit<Persona, "id">
): Promise<string> {
  const id = `persona_${Date.now()}`; // ID généré dynamiquement
  const ref = doc(db, "user_research_personas", id);
  await setDoc(ref, { id, ...data });
  return id;
}

/**
 * Récupère tous les personas de la collection
 */
export async function getAllPersonas(): Promise<Persona[]> {
  const ref = collection(db, "user_research_personas");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => doc.data() as Persona);
}

/**
 * Récupère un persona par ID
 */
export async function getPersona(id: string): Promise<Persona | null> {
  const ref = doc(db, "user_research_personas", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Persona;
}

/**
 * Sauvegarde un persona
 */
export async function savePersona(
  id: string,
  data: Omit<Persona, "id">
): Promise<void> {
  const ref = doc(db, "user_research_personas", id);
  await setDoc(ref, { id, ...data });
}

/**
 * Supprime un persona par ID
 */
export async function deletePersona(id: string): Promise<void> {
  const ref = doc(db, "user_research_personas", id);
  await deleteDoc(ref);
}
