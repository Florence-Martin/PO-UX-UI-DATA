// components/wireframes/WireframeImageUpload.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface WireframeImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface WireframeImageUploadProps {
  onImagesChange: (images: WireframeImage[]) => void;
  maxImages?: number;
}

export function WireframeImageUpload({
  onImagesChange,
  maxImages = 12,
}: WireframeImageUploadProps) {
  const [images, setImages] = useState<WireframeImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: WireframeImage[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const id = `img_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const url = URL.createObjectURL(file);

        newImages.push({
          id,
          name: file.name,
          url,
          file,
        });
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url); // Nettoyer la mémoire
        return false;
      }
      return true;
    });
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Zone de téléchargement */}
      <Card
        className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Cliquez pour télécharger des wireframes
            </p>
            <p className="text-xs text-muted-foreground">
              ou glissez-déposez vos images ici
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Formats supportés: PNG, JPG, JPEG, GIF, WEBP
            <br />
            Maximum {maxImages} images ({images.length}/{maxImages} utilisées)
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </Card>

      {/* Aperçu des images téléchargées */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Images téléchargées ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <Card className="p-2 hover:shadow-md transition-shadow">
                  <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-2 text-muted-foreground truncate">
                    {image.name}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions supplémentaires */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={images.length >= maxImages}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Ajouter des images
        </Button>

        {images.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Nettoyer toutes les URLs
              images.forEach((img) => URL.revokeObjectURL(img.url));
              setImages([]);
              onImagesChange([]);
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        )}
      </div>
    </div>
  );
}
