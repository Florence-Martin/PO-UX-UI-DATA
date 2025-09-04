// lib/services/firebaseInit.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Initialise les collections Firebase nécessaires pour les wireframes
 * Crée une grille par défaut si aucune n'existe
 */
export async function initializeWireframeCollections() {
  try {
    console.log("🔧 Initialisation des collections wireframes...");

    // Vérifier si la collection wireframe_grids existe déjà
    const gridsSnapshot = await getDocs(collection(db, "wireframe_grids"));

    if (gridsSnapshot.empty) {
      console.log("📝 Création de la grille par défaut...");

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

      console.log("✅ Grille par défaut créée avec l'ID:", gridRef.id);
      return gridRef.id;
    } else {
      console.log("✅ Collections wireframes déjà existantes");
      return gridsSnapshot.docs[0].id;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des collections:", error);
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

    console.log("✅ Collections wireframes vérifiées");
    return true;
  } catch (error) {
    console.log("🔧 Collections manquantes, initialisation...");
    await initializeWireframeCollections();
    return true;
  }
}
