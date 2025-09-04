// components/wireframes/WireframeImageList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Images, Trash2 } from "lucide-react";
import Image from "next/image";

interface WireframeImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface WireframeImageListProps {
  images: WireframeImage[];
  onRemoveImage: (id: string) => void;
}

export function WireframeImageList({
  images,
  onRemoveImage,
}: WireframeImageListProps) {
  const handleDragStart = (e: React.DragEvent, image: WireframeImage) => {
    e.dataTransfer.setData("image-id", image.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const downloadImage = (image: WireframeImage) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Bibliothèque d&apos;Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Images className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune image téléchargée</p>
            <p className="text-xs">
              Utilisez la zone de téléchargement ci-dessus
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="h-5 w-5" />
          Bibliothèque d&apos;Images ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            💡 Glissez les images vers la grille pour les positionner
          </p>

          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/50 cursor-move group transition-colors"
              >
                {/* Miniature */}
                <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(image.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => downloadImage(image)}
                    title="Télécharger"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => onRemoveImage(image.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
