"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WireframeImage } from "@/lib/services/wireframeService";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface WireframeImageViewerProps {
  image: WireframeImage;
  isOpen: boolean;
  onClose: () => void;
}

export function WireframeImageViewer({
  image,
  isOpen,
  onClose,
}: WireframeImageViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.downloadUrl;
    link.download = image.fileName || "wireframe.png";
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {image.name || "Wireframe"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative p-6 pt-2">
          <div className="flex justify-center">
            <Image
              src={image.downloadUrl}
              alt={image.name || "Wireframe"}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="p-6 pt-0 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>
              Position: Ligne {image.position.row + 1}, Colonne{" "}
              {image.position.col + 1}
            </span>
            <span>Fichier: {image.fileName}</span>
          </div>
          <div className="mt-1">
            Ajouté le:{" "}
            {image.uploadedAt.toDate().toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
