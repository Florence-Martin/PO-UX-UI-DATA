"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { useState } from "react";
import ProductVisionTemplateModal from "./ProductVisionTemplateModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function BacklogGoal() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);
  return (
    <Card className="mb-6 border-muted bg-muted/50">
      <CardContent className="flex flex-col gap-2 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-3">
            <Rocket className="h-7 w-7 text-primary" />
            <h3 className="text-base md:text-lg font-bold tracking-widest uppercase text-foreground">
              Vision produit
            </h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border border-green-500 rounded">
                  <ProductVisionTemplateModal />
                </span>
              </TooltipTrigger>
              <TooltipContent>Voir le template Vision Produit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-2 bg-background/60 rounded-lg px-4 py-3">
          <p
            className={`text-sm leading-relaxed transition-all duration-300 md:text-base ${
              expanded ? "" : "line-clamp-2 md:line-clamp-none"
            }`}
          >
            Cette application est le{" "}
            <strong className="text-primary">
              cockpit agile du Product Owner
            </strong>{" "}
            orienté{" "}
            <strong className="text-primary">UX, données et delivery</strong> -
            Un side-project d’apprentissage pratique - Elle structure les
            décisions produit de bout en bout — de l’analyse des besoins aux
            user stories, du backlog aux sprints, jusqu’à la validation qualité
            pour garantir une livraison cohérente, mesurable et centrée
            utilisateur.
          </p>
          {/* Bouton voir plus/moins, visible uniquement sur mobile */}
          <button
            className="mt-1 text-xs text-blue-500 md:hidden"
            onClick={toggleExpanded}
            type="button"
          >
            {expanded ? "voir moins" : "...voir plus"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
