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
  Pencil,
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
  const { icon, iconColor, title, userStory, items, status } = data;

  const LucideIcon = getLucideIcon(icon);

  return (
    <Card className="border border-border relative">
      <CardContent className="space-y-4 py-6 text-sm text-muted-foreground">
        {/* Bouton Modifier */}
        {onEdit && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-3 right-3 rounded-full w-8 h-8"
            onClick={() => onEdit(data)}
            title="Modifier ce trimestre"
            aria-label="Modifier"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}

        {/* Titre avec icône et badge de statut */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-foreground font-medium text-base">
          <div className="flex items-center gap-2">
            {LucideIcon && <LucideIcon className={`w-5 h-5 ${iconColor}`} />}
            {title}
          </div>
          <div className="shrink-0">
            <Badge
              className={`ml-auto px-2.5 py-0.5 rounded-full font-semibold text-[10px] sm:text-xs tracking-wide 
                ${getBadgeStyle(status)} 
                shadow-sm border border-white/10`}
            >
              {status === "done"
                ? "Terminé"
                : status === "in-progress"
                ? "En cours"
                : "À faire"}
            </Badge>
          </div>
        </div>

        {/* Contexte user story */}
        <blockquote className="text-muted-foreground italic text-sm border-l-2 border-muted pl-4 mt-2">
          {userStory}
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
