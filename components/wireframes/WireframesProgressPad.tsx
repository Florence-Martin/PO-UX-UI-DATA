// components/wireframes/WireframesProgressPad.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getWireframesProgressLevel,
  setWireframesProgressLevel,
  PROGRESS_LABELS,
  type ProgressLevel,
} from "@/lib/services/progressService";
import { Palette } from "lucide-react";

export function WireframesProgressPad() {
  const [currentLevel, setCurrentLevel] = useState<ProgressLevel>(0);

  useEffect(() => {
    setCurrentLevel(getWireframesProgressLevel());
  }, []);

  const handleLevelSelect = (level: ProgressLevel) => {
    setCurrentLevel(level);
    setWireframesProgressLevel(level);
  };

  // ✅ Fonction pour les couleurs des boutons
  const getLevelButtonStyle = (level: ProgressLevel) => {
    const isSelected = level === currentLevel;

    if (isSelected) {
      switch (level) {
        case 0:
          return "bg-gray-500 hover:bg-gray-600 text-white border-gray-500";
        case 1:
          return "bg-red-500 hover:bg-red-600 text-white border-red-500";
        case 2:
          return "bg-orange-500 hover:bg-orange-600 text-white border-orange-500";
        case 3:
          return "bg-blue-500 hover:bg-blue-600 text-white border-blue-500";
        case 4:
          return "bg-green-500 hover:bg-green-600 text-white border-green-500";
      }
    } else {
      // Style non sélectionné avec couleur de bordure
      switch (level) {
        case 0:
          return "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700";
        case 1:
          return "border-red-300 text-red-600 hover:border-red-400 hover:text-red-700";
        case 2:
          return "border-orange-300 text-orange-600 hover:border-orange-400 hover:text-orange-700";
        case 3:
          return "border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700";
        case 4:
          return "border-green-300 text-green-600 hover:border-green-400 hover:text-green-700";
      }
    }
  };

  // ✅ Fonction pour la couleur du badge
  const getLevelBadgeColor = (level: ProgressLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case 1:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 2:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case 3:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 4:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <h3 className="text-base sm:text-lg font-semibold">
            Progression Wireframes
          </h3>
        </div>
      </div>

      {/* Affichage du pourcentage et badge responsive */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          {currentLevel * 25}%
        </div>
        <Badge
          className={`text-xs sm:text-sm ${getLevelBadgeColor(currentLevel)}`}
        >
          {PROGRESS_LABELS[currentLevel]}
        </Badge>
      </div>

      {/* Grille de boutons + légendes alignées verticalement */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 max-w-md mx-auto">
        {([0, 1, 2, 3, 4] as ProgressLevel[]).map((level) => (
          <div key={level} className="flex flex-col items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLevelSelect(level)}
              className={`
            aspect-square 
            text-base sm:text-lg 
            font-bold 
            transition-all duration-200 
            h-12 w-12 sm:h-14 sm:w-14 
            ${getLevelButtonStyle(level)}
          `}
            >
              {level}
            </Button>
            <span
              className={`
            mt-1 text-xs
            ${
              level === 0
                ? "text-gray-600"
                : level === 1
                  ? "text-red-600"
                  : level === 2
                    ? "text-orange-600"
                    : level === 3
                      ? "text-blue-600"
                      : "text-green-600"
            }
          `}
            >
              {level * 25}%
            </span>
          </div>
        ))}
      </div>

      {/* Légende d'instruction */}
      <div className="text-center text-xs sm:text-sm px-2 text-muted-foreground mt-2">
        Cliquez sur un chiffre pour d&eacute;finir l&apos;avancement
      </div>
    </Card>
  );
}
