// RoadmapCard.tsx
"use client";

import { RoadmapQuarter } from "@/lib/types/roadmapQuarter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  CheckCircle,
  Clock,
  Hourglass,
  RefreshCw,
  FlagTriangleRight,
  TowerControl,
  TrendingUp,
  Brain,
  PencilLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyle, getLucideIcon } from "@/lib/utils/roadmap";

interface RoadmapCardProps {
  data: RoadmapQuarter;
  onEdit?: (quarter: RoadmapQuarter) => void;
}

// 👇 mapping des icônes disponibles
const iconMap = {
  Check,
  CheckCircle,
  Clock,
  Hourglass,
  RefreshCw,
  FlagTriangleRight,
  TowerControl,
  TrendingUp,
  Brain,
};

export function RoadmapCard({ data, onEdit }: RoadmapCardProps) {
  const { icon, iconColor, title, productVision, items, status } = data;

  const LucideIcon = getLucideIcon(icon);

  return (
    <Card className="border border-border relative">
      <CardContent className="space-y-4 py-6 text-sm text-muted-foreground">
        {/* En-tête : titre + icône + badge + bouton modifier */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-foreground font-medium text-base">
          {/* Partie gauche : icône + titre */}
          <div className="flex items-center gap-2">
            {LucideIcon && <LucideIcon className={`w-5 h-5 ${iconColor}`} />}
            {title}
          </div>

          {/* Partie droite : badge + bouton d'édition */}
          <div className="flex items-center gap-2">
            <Badge
              className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] sm:text-xs tracking-wide 
        ${getBadgeStyle(status)} 
        shadow-sm border border-white/10`}
            >
              {status === "done"
                ? "Terminé"
                : status === "in-progress"
                ? "En cours"
                : "À faire"}
            </Badge>

            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 gap-2"
                onClick={() => onEdit(data)}
                title="Modifier ce trimestre"
                aria-label="Modifier"
              >
                <PencilLine className="w-4 h-4" />
                <span>Editer</span>
              </Button>
            )}
          </div>
        </div>

        {/* Contexte */}
        <blockquote className="text-muted-foreground italic text-sm border-l-2 border-muted pl-4 mt-2">
          {productVision}
        </blockquote>

        {/* Liste des éléments */}
        <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index}>
              <div className="font-medium text-foreground">{item.label}</div>
              <p className="italic text-muted-foreground text-xs ml-4">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
