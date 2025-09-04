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
              {image.fileName || "Wireframe"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Fermer
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-auto">
          <div className="relative flex justify-center">
            <Image
              src={image.downloadUrl}
              alt={image.fileName || "Wireframe"}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
