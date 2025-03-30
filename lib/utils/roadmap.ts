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
} from "lucide-react";
import { RoadmapQuarter } from "@/lib/types/roadmapQuarter";

// Mapping des icônes disponibles
export const iconMap = {
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

// Fonction sécurisée pour récupérer une icône Lucide
export function getLucideIcon(name: string) {
  return iconMap[name as keyof typeof iconMap] || FlagTriangleRight;
}

// Style du badge en fonction du statut
export function getBadgeStyle(status: RoadmapQuarter["status"]) {
  switch (status) {
    case "done":
      return "bg-green-500 text-white";
    case "in-progress":
      return "bg-yellow-500 text-black";
    case "upcoming":
    default:
      return "bg-red-500 text-white";
  }
}
