import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserResearchDoc = {
  id: string;
  title: string;
  content: string;
};

/**
 * Récupère un document depuis Firestore par son ID
 */
export async function getTemplate(id: string): Promise<UserResearchDoc | null> {
  try {
    const ref = doc(db, "user_research_documents", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error(`Le document "${id}" n'existe pas dans Firestore`);
    }

    return snapshot.data() as UserResearchDoc;
  } catch (error) {
    console.error("Erreur lors du chargement du template :", error);
    throw error;
  }
}

/**
 * Sauvegarde un document dans Firestore (écrase si existant)
 */
export async function saveTemplate(
  id: string,
  data: { title: string; content: string }
): Promise<void> {
  try {
    const ref = doc(db, "user_research_documents", id);
    await setDoc(ref, {
      id,
      ...data,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du template :", error);
  }
}
