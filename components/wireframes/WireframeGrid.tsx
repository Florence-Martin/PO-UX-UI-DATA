// components/wireframes/WireframeGrid.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Layout, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface WireframeImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface WireframeGridProps {
  gridSize: { cols: number; rows: number };
  images: WireframeImage[];
  onImageClick?: (image: WireframeImage) => void;
}

export function WireframeGrid({
  gridSize,
  images,
  onImageClick,
}: WireframeGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggedCellIndex, setDraggedCellIndex] = useState<number | null>(null);

  const totalCells = gridSize.cols * gridSize.rows;
  const [imageMapping, setImageMapping] = useState<
    Record<number, WireframeImage>
  >({});

  const handleCellClick = (cellIndex: number, image?: WireframeImage) => {
    if (image) {
      setSelectedImage(selectedImage === image.id ? null : image.id);
      onImageClick?.(image);
    }
  };

  const handleDrop = (e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    setDraggedCellIndex(null);

    // Si on drag une image depuis la liste
    const imageId = e.dataTransfer.getData("image-id");
    const image = images.find((img) => img.id === imageId);

    if (image) {
      setImageMapping((prev) => ({
        ...prev,
        [cellIndex]: image,
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    setDraggedCellIndex(cellIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Seulement si on quitte vraiment la zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedCellIndex(null);
    }
  };

  const removeCellImage = (cellIndex: number) => {
    setImageMapping((prev) => {
      const newMapping = { ...prev };
      delete newMapping[cellIndex];
      return newMapping;
    });
  };

  const downloadImage = (image: WireframeImage) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Grille de Wireframes ({gridSize.cols}x{gridSize.rows})
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {Object.keys(imageMapping).length}/{totalCells} cases remplies
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-2 p-4 bg-muted rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, minmax(120px, 1fr))`,
          }}
        >
          {Array.from({ length: totalCells }).map((_, index) => {
            const image = imageMapping[index];
            const isSelected = selectedImage === image?.id;

            return (
              <div
                key={index}
                className={`relative bg-background border-2 rounded-md transition-all duration-200 group cursor-pointer ${
                  image
                    ? `border-primary/50 hover:border-primary shadow-sm ${
                        isSelected ? "ring-2 ring-primary shadow-md" : ""
                      }`
                    : "border-dashed border-border hover:border-border/70"
                }`}
                onClick={() => handleCellClick(index, image)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {image ? (
                  <>
                    {/* Image du wireframe */}
                    <div className="absolute inset-2 rounded overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Overlay avec actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-md flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image.id);
                          }}
                          title="Agrandir"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(image);
                          }}
                          title="Télécharger"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Nom de l'image */}
                    <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate">{image.name}</p>
                    </div>

                    {/* Indicateur de position */}
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </>
                ) : (
                  /* Case vide */
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Layout className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <div className="text-xs">
                        Case {index + 1}
                        <br />
                        <span className="text-[10px]">
                          Glissez une image ici
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Instructions :</strong> Glissez-déposez vos images
            téléchargées dans les cases de la grille. Cliquez sur une image pour
            la sélectionner ou utilisez les boutons d&apos;action.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
