// components/wireframes/WireframeGridSimplified.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWireframeGrid } from "@/hooks/useWireframeGrid";
import { WireframeImage } from "@/lib/services/wireframeService";
import { Download, Layout, Maximize2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { WireframeImageViewer } from "./WireframeImageViewer";

interface WireframeGridProps {
  gridId?: string;
  onImageChange?: (
    row: number,
    col: number,
    image: WireframeImage | null
  ) => void;
}

export function WireframeGridSimplified({
  gridId,
  onImageChange,
}: WireframeGridProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerCurrentImage, setViewerCurrentImage] =
    useState<WireframeImage | null>(null);
  const [uploadingCells, setUploadingCells] = useState<string[]>([]);

  const {
    grid,
    images,
    isLoading,
    error,
    handleImageUpload,
    removeImage,
    updateGridConfig,
  } = useWireframeGrid(gridId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Chargement de la grille...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-2">❌ {error}</p>
        <Button onClick={() => window.location.reload()}>Recharger</Button>
      </div>
    );
  }

  if (!grid) {
    return (
      <div className="text-center p-4">
        <p>Aucune grille trouvée</p>
      </div>
    );
  }

  // Gestion de l'upload d'image
  const handleFileUpload = async (file: File, row: number, col: number) => {
    const cellKey = `${row}_${col}`;
    setUploadingCells((prev) => [...prev, cellKey]);

    try {
      await handleImageUpload(file, row, col);

      // L'image est maintenant disponible dans le state via le hook
      const cellKey = `${row}_${col}`;
      const uploadedImage = images[cellKey];

      if (uploadedImage) {
        onImageChange?.(row, col, uploadedImage);
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingCells((prev) => prev.filter((key) => key !== cellKey));
    }
  };

  // Ouverture du viewer avec gestion de l'image
  const handleImageClick = (row: number, col: number) => {
    const cellKey = `${row}_${col}`;
    const image = images[cellKey];
    if (image) {
      setViewerCurrentImage(image);
      setViewerOpen(true);
    }
  };

  // Suppression d'image
  const handleImageDelete = async (row: number, col: number) => {
    try {
      await removeImage(row, col);
      onImageChange?.(row, col, null);
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression de l'image");
    }
  };

  // Téléchargement d'image
  const handleDownload = (image: WireframeImage) => {
    const link = document.createElement("a");
    link.href = image.downloadUrl;
    link.download = image.fileName;
    link.click();
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setViewerCurrentImage(null);
  };

  // Calculs pour les statistiques
  const totalCells = grid.gridSize.cols * grid.gridSize.rows;
  const filledCells = Object.keys(images).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            {grid.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {filledCells}/{totalCells} cases remplies
            {grid.description && ` • ${grid.description}`}
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-2 p-4 bg-muted/20 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${grid.gridSize.cols}, 1fr)`,
            }}
          >
            {Array.from({ length: totalCells }).map((_, index) => {
              const row = Math.floor(index / grid.gridSize.cols);
              const col = index % grid.gridSize.cols;
              const cellKey = `${row}_${col}`;
              const image = images[cellKey];
              const isUploading = uploadingCells.includes(cellKey);

              return (
                <div
                  key={cellKey}
                  className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                >
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : image ? (
                    <div className="relative h-full group">
                      <Image
                        src={image.downloadUrl}
                        alt={image.fileName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(row, col)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg">
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(row, col);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0"
                            onClick={() => handleImageClick(row, col)}
                          >
                            <Maximize2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, row, col);
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-xs">Cliquez pour ajouter</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Viewer Modal */}
      {viewerOpen && viewerCurrentImage && (
        <WireframeImageViewer
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          image={viewerCurrentImage}
        />
      )}
    </div>
  );
}
