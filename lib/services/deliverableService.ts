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
  updateDoc,
} from "firebase/firestore";
import { logger } from "../utils/logger";

export interface Deliverable {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "delayed" | "pending";
  dueDate: string;
  owner: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const collectionName = "deliverables";

/**
 * Récupère tous les livrables BI
 */
export async function getDeliverables(): Promise<Deliverable[]> {
  try {
    const q = query(collection(db, collectionName), orderBy("dueDate", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Deliverable[];
  } catch (error) {
    logger.error("Erreur lors de la récupération des livrables:", error);
    return [];
  }
}

/**
 * Crée un nouveau livrable
 */
export async function createDeliverable(
  data: Omit<Deliverable, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
    });
    logger.info("Livrable créé:", docRef.id);
    return docRef.id;
  } catch (error) {
    logger.error("Erreur lors de la création du livrable:", error);
    throw error;
  }
}

/**
 * Met à jour un livrable
 */
export async function updateDeliverable(
  id: string,
  data: Partial<Omit<Deliverable, "id" | "createdAt">>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);

    // Filtrer les valeurs undefined pour éviter les erreurs Firestore
    const updateData = Object.entries({
      ...data,
      updatedAt: Timestamp.now(),
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    await updateDoc(docRef, updateData);
    logger.info("Livrable mis à jour:", id);
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du livrable:", error);
    throw error;
  }
}

/**
 * Supprime un livrable
 */
export async function deleteDeliverable(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
    logger.info("Livrable supprimé:", id);
  } catch (error) {
    logger.error("Erreur lors de la suppression du livrable:", error);
    throw error;
  }
}

/**
 * Calcule les statistiques des livrables
 */
export function calculateDeliverableStats(deliverables: Deliverable[]) {
  const total = deliverables.length;
  const completed = deliverables.filter((d) => d.status === "completed").length;
  const inProgress = deliverables.filter(
    (d) => d.status === "in_progress"
  ).length;
  const delayed = deliverables.filter((d) => d.status === "delayed").length;

  return {
    total,
    completed,
    inProgress,
    delayed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
