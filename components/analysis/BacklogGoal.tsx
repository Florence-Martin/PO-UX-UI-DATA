"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { useState } from "react";

export default function BacklogGoal() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);
  return (
    <Card className="mb-6 border-muted bg-muted/50">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="mt-1">
          <Rocket className="h-6 w-6 text-primary" />
        </div>
        <div className="w-full">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Vision produit
          </h3>

          <p
            className={`text-sm text-foreground leading-relaxed transition-all duration-300 ${
              expanded
                ? ""
                : "overflow-hidden text-ellipsis md:overflow-visible"
            }`}
            style={
              expanded
                ? {}
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    maxHeight: "3.2em",
                  }
            }
          >
            Cette application est le{" "}
            <strong>cockpit agile du Product Owner</strong> orienté{" "}
            <strong>UX, données et delivery</strong>. Elle structure les
            décisions produit de bout en bout — de l’analyse des besoins aux
            user stories, du backlog aux sprints, jusqu’à la validation qualité
            — pour garantir une livraison cohérente, mesurable et centrée
            utilisateur.
          </p>

          {/* Ce bouton est uniquement visible sur mobile (caché en md et au-delà) */}
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
