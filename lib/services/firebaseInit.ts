// lib/services/firebaseInit.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { logger } from "../utils/logger";

/**
 * Initialise les collections Firebase nécessaires pour les wireframes
 * Crée une grille par défaut si aucune n'existe
 */
export async function initializeWireframeCollections() {
  try {
    logger.info("🔧 Initialisation des collections wireframes...");

    // Vérifier si la collection wireframe_grids existe déjà
    const gridsSnapshot = await getDocs(collection(db, "wireframe_grids"));

    if (gridsSnapshot.empty) {
      logger.info("📝 Création de la grille par défaut...");

      // Créer une grille par défaut
      const defaultGridData = {
        name: "Grille par défaut",
        description: "Grille wireframes par défaut",
        gridSize: {
          cols: 4,
          rows: 3,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Créer la grille avec un ID spécifique
      const gridRef = doc(collection(db, "wireframe_grids"));
      await setDoc(gridRef, defaultGridData);

      logger.info("✅ Grille par défaut créée avec l'ID:", gridRef.id);
      return gridRef.id;
    } else {
      logger.info("✅ Collections wireframes déjà existantes");
      return gridsSnapshot.docs[0].id;
    }
  } catch (error) {
    logger.error("❌ Erreur lors de l'initialisation des collections:", error);
    throw error;
  }
}

/**
 * Vérifie si les collections Firebase existent et les crée si nécessaire
 */
export async function ensureWireframeCollectionsExist() {
  try {
    // Test de lecture sur la collection wireframe_grids
    const gridsCollection = collection(db, "wireframe_grids");
    await getDocs(gridsCollection);

    // Test de lecture sur la collection wireframe_images
    const imagesCollection = collection(db, "wireframe_images");
    await getDocs(imagesCollection);

    logger.info("✅ Collections wireframes vérifiées");
    return true;
  } catch (error) {
    logger.info("🔧 Collections manquantes, initialisation...");
    await initializeWireframeCollections();
    return true;
  }
}
