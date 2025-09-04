"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WireframeWithConfig } from "@/components/wireframes/WireframeWithConfig";
import { WireframeImage } from "@/lib/services/wireframeService";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { WireframesProgressPad } from "../wireframes/WireframesProgressPad";

export function Wireframes() {
  const handleImageChange = (
    row: number,
    col: number,
    image: WireframeImage | null
  ) => {
    console.log(
      `Case ${row},${col}:`,
      image ? `Image "${image.fileName}" ajoutée` : "Image supprimée"
    );
  };

  return (
    <div className="space-y-6">
      {/* Section de progression - en haut pour la visibilité */}
      <WireframesProgressPad />

      {/* Grille avec configuration intégrée */}
      <WireframeWithConfig onImageChange={handleImageChange} />

      {/* Panneau d'informations et liens */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Liens Figma */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Image
                src="/figma.svg"
                alt="Figma Logo"
                width={10}
                height={10}
                className="inline-block h-6 w-6 mr-2"
              />
              Liens Figma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/not-found")}
              title="Lien pas disponible 🙂 "
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Maquettes HD
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/not-found")}
              title="Lien pas disponible 🙂 "
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Design System
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Mode d&apos;emploi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-mono text-xs bg-blue-50 px-1 rounded">
                  1
                </span>
                <span>
                  Cliquez sur une case vide pour télécharger une image
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-mono text-xs bg-green-50 px-1 rounded">
                  2
                </span>
                <span>Survolez une image pour accéder aux actions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-500 font-mono text-xs bg-purple-50 px-1 rounded">
                  3
                </span>
                <span>Configurez la grille selon vos besoins</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
