import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { logger } from "../utils/logger";

export interface WireframeGrid {
  id?: string;
  name: string;
  description?: string;
  gridSize: {
    cols: number;
    rows: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WireframeImage {
  id?: string;
  gridId: string;
  cellIndex: number;
  name: string;
  fileName: string;
  storageUrl: string;
  downloadUrl: string;
  position: {
    row: number;
    col: number;
  };
  uploadedAt: Timestamp;
}

class WireframeService {
  private gridsCollection = collection(db, "wireframe_grids");
  private imagesCollection = collection(db, "wireframe_images");

  // Gestion des grilles
  async createGrid(
    gridData: Omit<WireframeGrid, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      logger.debug("🔧 WireframeService: Création grille...", gridData);

      const now = Timestamp.now();
      const docRef = await addDoc(this.gridsCollection, {
        ...gridData,
        createdAt: now,
        updatedAt: now,
      });

      logger.info("✅ WireframeService: Grille créée:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      logger.error("❌ WireframeService: Erreur création:", error);
      throw error;
    }
  }

  async updateGrid(
    gridId: string,
    updates: Partial<WireframeGrid>
  ): Promise<void> {
    try {
      const gridRef = doc(this.gridsCollection, gridId);
      await updateDoc(gridRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      logger.error("Erreur lors de la mise à jour de la grille:", error);
      throw error;
    }
  }

  async deleteGrid(gridId: string): Promise<void> {
    try {
      // Supprimer d'abord toutes les images de la grille
      const images = await this.getGridImages(gridId);
      await Promise.all(images.map((img) => this.deleteImage(img.id!)));

      // Puis supprimer la grille
      const gridRef = doc(this.gridsCollection, gridId);
      await deleteDoc(gridRef);
    } catch (error: any) {
      logger.error("Erreur lors de la suppression de la grille:", error);
      throw error;
    }
  }

  async getGrid(gridId: string): Promise<WireframeGrid | null> {
    try {
      const gridRef = doc(this.gridsCollection, gridId);
      const gridSnap = await getDoc(gridRef);

      if (gridSnap.exists()) {
        return { id: gridSnap.id, ...gridSnap.data() } as WireframeGrid;
      }
      return null;
    } catch (error) {
      logger.error("Erreur lors de la récupération de la grille:", error);
      throw error;
    }
  }

  async getAllGrids(): Promise<WireframeGrid[]> {
    try {
      logger.debug("🔧 WireframeService: Récupération grilles...");

      // Temporairement sans orderBy pour éviter l'erreur d'index
      const querySnapshot = await getDocs(this.gridsCollection);

      logger.info(
        "✅ WireframeService: Grilles récupérées:",
        querySnapshot.size
      );

      const grids = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WireframeGrid[];

      // Tri côté client temporaire
      return grids.sort(
        (a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis()
      );
    } catch (error) {
      logger.error("❌ WireframeService: Erreur récupération grilles:", error);
      throw error;
    }
  }

  // Gestion des images (solution locale avec dossier public)
  async uploadImage(
    gridId: string,
    cellIndex: number,
    file: File,
    gridSize: { cols: number; rows: number }
  ): Promise<WireframeImage> {
    try {
      // Calculer la position dans la grille
      const row = Math.floor(cellIndex / gridSize.cols);
      const col = cellIndex % gridSize.cols;

      // Créer un nom de fichier unique
      const fileName = `${gridId}_cell_${cellIndex}_${Date.now()}_${file.name}`;

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("gridId", gridId);

      // Uploader via API route
      const response = await fetch("/api/upload-wireframe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur upload: ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();

      // URL publique de l'image
      const downloadUrl = `/wireframes/${fileName}`;

      // Sauvegarder les métadonnées dans Firestore
      const imageData: Omit<WireframeImage, "id"> = {
        gridId,
        cellIndex,
        name: file.name,
        fileName,
        storageUrl: responseData.filePath,
        downloadUrl,
        position: { row: row + 1, col: col + 1 },
        uploadedAt: Timestamp.now(),
      };

      const docRef = await addDoc(this.imagesCollection, imageData);
      return { ...imageData, id: docRef.id };
    } catch (error) {
      logger.error("Erreur upload image:", error);
      throw error;
    }
  }

  async updateImage(
    imageId: string,
    updates: Partial<WireframeImage>
  ): Promise<void> {
    try {
      const imageRef = doc(this.imagesCollection, imageId);
      await updateDoc(imageRef, updates);
    } catch (error: any) {
      logger.error("Erreur lors de la mise à jour de l'image:", error);
      throw error;
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      // Récupérer les infos de l'image pour supprimer le fichier
      const imageRef = doc(this.imagesCollection, imageId);
      const imageSnap = await getDoc(imageRef);

      if (imageSnap.exists()) {
        const imageData = imageSnap.data() as WireframeImage;

        // Supprimer le fichier via API route
        await fetch("/api/delete-wireframe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: imageData.fileName }),
        });

        // Supprimer le document Firestore
        await deleteDoc(imageRef);
      }
    } catch (error: any) {
      logger.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  }

  async getGridImages(gridId: string): Promise<WireframeImage[]> {
    try {
      const q = query(this.imagesCollection, where("gridId", "==", gridId));
      const querySnapshot = await getDocs(q);

      const images = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WireframeImage[];

      // Tri côté client
      return images.sort((a, b) => a.cellIndex - b.cellIndex);
    } catch (error) {
      logger.error(
        "Erreur lors de la récupération des images de la grille:",
        error
      );
      throw error;
    }
  }

  async getImage(imageId: string): Promise<WireframeImage | null> {
    try {
      const imageRef = doc(this.imagesCollection, imageId);
      const imageSnap = await getDoc(imageRef);

      if (imageSnap.exists()) {
        return { id: imageSnap.id, ...imageSnap.data() } as WireframeImage;
      }
      return null;
    } catch (error) {
      logger.error("Erreur lors de la récupération de l'image:", error);
      throw error;
    }
  }

  // Utilitaires
  async replaceImage(
    gridId: string,
    cellIndex: number,
    newFile: File,
    gridSize: { cols: number; rows: number }
  ): Promise<WireframeImage> {
    try {
      // Trouver l'ancienne image s'il y en a une
      const images = await this.getGridImages(gridId);
      const oldImage = images.find((img) => img.cellIndex === cellIndex);

      // Supprimer l'ancienne image si elle existe
      if (oldImage && oldImage.id) {
        await this.deleteImage(oldImage.id);
      }

      // Uploader la nouvelle image
      return await this.uploadImage(gridId, cellIndex, newFile, gridSize);
    } catch (error) {
      logger.error("Erreur lors du remplacement de l'image:", error);
      throw error;
    }
  }

  // Méthode pour créer une grille par défaut pour les wireframes
  async getOrCreateDefaultGrid(): Promise<WireframeGrid> {
    try {
      const grids = await this.getAllGrids();
      const defaultGrid = grids.find(
        (grid) => grid.name === "Grille par défaut"
      );

      if (defaultGrid) {
        return defaultGrid;
      }

      // Créer une grille par défaut si elle n'existe pas
      const gridId = await this.createGrid({
        name: "Grille par défaut",
        description: "Grille de wireframes par défaut",
        gridSize: { cols: 3, rows: 3 },
      });

      const newGrid = await this.getGrid(gridId);
      return newGrid!;
    } catch (error) {
      logger.error(
        "Erreur lors de la création/récupération de la grille par défaut:",
        error
      );
      throw error;
    }
  }
}

export const wireframeService = new WireframeService();
