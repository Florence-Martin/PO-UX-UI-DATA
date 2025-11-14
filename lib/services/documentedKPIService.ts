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

export interface DocumentedKPI {
  id: string;
  name: string;
  definition: string;
  source?: string; // Optionnel car on a dataSources aussi
  objective?: string; // Optionnel car on a target aussi
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  owner: string;
  category?:
    | "product"
    | "agile"
    | "business"
    | "ux"
    | "quality"
    | "marketing"
    | "sales"
    | "technical";
  // Nouveaux champs pour le format amélioré
  target?: string;
  dataSources?: string[];
  visualizationType?: "line" | "bar" | "gauge" | "funnel" | "pie";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const collectionName = "documented_kpis";

/**
 * Récupère tous les KPIs documentés
 */
export async function getDocumentedKPIs(): Promise<DocumentedKPI[]> {
  try {
    const q = query(collection(db, collectionName), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DocumentedKPI[];
  } catch (error) {
    logger.error("Erreur lors de la récupération des KPIs documentés:", error);
    return [];
  }
}

/**
 * Crée un nouveau KPI documenté
 */
export async function createDocumentedKPI(
  data: Omit<DocumentedKPI, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
    });
    logger.info("KPI documenté créé:", docRef.id);
    return docRef.id;
  } catch (error) {
    logger.error("Erreur lors de la création du KPI documenté:", error);
    throw error;
  }
}

/**
 * Met à jour un KPI documenté
 */
export async function updateDocumentedKPI(
  id: string,
  data: Partial<Omit<DocumentedKPI, "id" | "createdAt">>
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
    logger.info("KPI documenté mis à jour:", id);
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du KPI documenté:", error);
    throw error;
  }
}

/**
 * Supprime un KPI documenté
 */
export async function deleteDocumentedKPI(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
    logger.info("KPI documenté supprimé:", id);
  } catch (error) {
    logger.error("Erreur lors de la suppression du KPI documenté:", error);
    throw error;
  }
}

/**
 * Formate la fréquence pour l'affichage
 */
export function formatFrequency(frequency: DocumentedKPI["frequency"]): string {
  const mapping = {
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    quarterly: "Trimestriel",
  };
  return mapping[frequency];
}
