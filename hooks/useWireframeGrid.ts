import {
  WireframeGrid,
  WireframeImage,
  wireframeService,
} from "@/lib/services/wireframeService";
import { useCallback, useEffect, useState } from "react";

export function useWireframeGrid(gridId?: string) {
  const [grid, setGrid] = useState<WireframeGrid | null>(null);
  const [images, setImages] = useState<Record<string, WireframeImage>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de la grille
  const loadGridData = useCallback(async () => {
    try {
      console.log("🔄 Début du chargement de la grille, gridId:", gridId);
      setIsLoading(true);
      setError(null);

      let currentGrid: WireframeGrid | null = null;

      if (gridId) {
        console.log("📋 Chargement grille spécifique:", gridId);
        currentGrid = await wireframeService.getGrid(gridId);
      } else {
        console.log("📋 Chargement grilles existantes...");
        // Créer une grille par défaut si aucun ID fourni
        const grids = await wireframeService.getAllGrids();
        console.log("📊 Grilles trouvées:", grids.length);

        if (grids.length === 0) {
          console.log("🆕 Création d'une nouvelle grille par défaut...");
          const newGridId = await wireframeService.createGrid({
            name: "Grille par défaut",
            description: "Grille wireframes par défaut",
            gridSize: { cols: 4, rows: 3 },
          });
          currentGrid = await wireframeService.getGrid(newGridId);
        } else {
          currentGrid = grids[0];
          console.log(
            "✅ Utilisation de la grille existante:",
            currentGrid?.id
          );
        }
      }

      if (currentGrid) {
        console.log("📐 Grille chargée:", currentGrid);
        setGrid(currentGrid);

        // Charger les images de cette grille
        console.log("🖼️ Chargement des images pour grille:", currentGrid.id);
        const gridImages = await wireframeService.getGridImages(
          currentGrid.id!
        );
        console.log("📸 Images trouvées:", gridImages.length);

        const imageMapping: Record<string, WireframeImage> = {};

        gridImages.forEach((img) => {
          const cellKey = `${img.position.row - 1}_${img.position.col - 1}`;
          imageMapping[cellKey] = img;
          console.log("🔗 Image mappée:", cellKey, img.fileName);
        });

        setImages(imageMapping);
        console.log("✅ Chargement terminé avec succès");
      } else {
        console.log("❌ Aucune grille trouvée ou créée");
        setError("Aucune grille disponible");
      }
    } catch (error) {
      console.error("❌ Erreur complète chargement grille:", error);
      setError(
        "Erreur lors du chargement de la grille. Vérifiez votre connexion Firebase."
      );
    } finally {
      setIsLoading(false);
    }
  }, [gridId]);

  // Ajouter/remplacer une image
  const handleImageUpload = useCallback(
    async (file: File, row: number, col: number): Promise<void> => {
      if (!grid) {
        throw new Error("Aucune grille sélectionnée");
      }

      try {
        // Vérifier s'il y a déjà une image à cette position
        const gridImages = await wireframeService.getGridImages(grid.id!);
        const cellIndex = row * grid.gridSize.cols + col;
        const existingImage = gridImages.find(
          (img) => img.cellIndex === cellIndex
        );

        if (existingImage) {
          // Supprimer l'ancienne image
          await wireframeService.deleteImage(existingImage.id!);
        }

        // Uploader la nouvelle image
        const uploadedImage = await wireframeService.uploadImage(
          grid.id!,
          cellIndex,
          file,
          grid.gridSize
        );

        // Mettre à jour l'état local en récupérant les images depuis le service
        const updatedGridImages = await wireframeService.getGridImages(
          grid.id!
        );
        const updatedImage = updatedGridImages.find(
          (img) => img.id === uploadedImage.id
        );
        if (updatedImage) {
          const cellKey = `${row}_${col}`;
          setImages((prev) => ({
            ...prev,
            [cellKey]: updatedImage,
          }));
        }
      } catch (error) {
        console.error("Erreur upload image:", error);
        throw error;
      }
    },
    [grid]
  );

  // Supprimer une image
  const removeImage = useCallback(
    async (row: number, col: number): Promise<void> => {
      if (!grid) return;

      try {
        const gridImages = await wireframeService.getGridImages(grid.id!);
        const cellIndex = row * grid.gridSize.cols + col;
        const existingImage = gridImages.find(
          (img) => img.cellIndex === cellIndex
        );

        if (existingImage) {
          await wireframeService.deleteImage(existingImage.id!);

          // Mettre à jour l'état local
          const cellKey = `${row}_${col}`;
          setImages((prev) => {
            const newImages = { ...prev };
            delete newImages[cellKey];
            return newImages;
          });
        }
      } catch (error) {
        console.error("Erreur suppression image:", error);
        throw new Error("Erreur lors de la suppression de l'image");
      }
    },
    [grid]
  );

  // Charger les grilles disponibles
  const loadAvailableGrids = useCallback(async (): Promise<WireframeGrid[]> => {
    try {
      return await wireframeService.getAllGrids();
    } catch (error) {
      console.error("Erreur chargement grilles:", error);
      return [];
    }
  }, []);

  // Créer une nouvelle grille
  const createNewGrid = useCallback(
    async (name: string, cols: number, rows: number): Promise<string> => {
      try {
        return await wireframeService.createGrid({
          name,
          description: `Grille ${cols}x${rows}`,
          gridSize: { cols, rows },
        });
      } catch (error) {
        console.error("Erreur création grille:", error);
        throw new Error("Erreur lors de la création de la grille");
      }
    },
    []
  );

  // Mettre à jour la configuration de la grille
  const updateGridConfig = useCallback(
    async (cols: number, rows: number): Promise<void> => {
      if (!grid) return;

      try {
        await wireframeService.updateGrid(grid.id!, {
          gridSize: { cols, rows },
          description: `Grille ${cols}x${rows}`,
        });

        // Recharger les données
        await loadGridData();
      } catch (error) {
        console.error("Erreur mise à jour grille:", error);
        throw new Error("Erreur lors de la mise à jour de la grille");
      }
    },
    [grid, loadGridData]
  );

  // Charger les données au montage
  useEffect(() => {
    loadGridData();
  }, [loadGridData]);

  return {
    grid,
    images,
    isLoading,
    error,
    handleImageUpload,
    removeImage,
    loadAvailableGrids,
    createNewGrid,
    updateGridConfig,
    reloadGrid: loadGridData,
  };
}
