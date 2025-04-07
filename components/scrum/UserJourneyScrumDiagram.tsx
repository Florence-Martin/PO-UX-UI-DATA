"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import UserJourneyZigZag from "./UserJourneyZigZag";

import {
  Search,
  FolderKanban,
  UsersRound,
  FilePlus2,
  UserRound,
  BarChart3,
  CalendarClock,
  Lightbulb,
} from "lucide-react";

const steps: {
  title: string;
  period: "Matinée" | "Après-midi" | "Soirée";
  intensity: number;
  icon: React.ElementType;
}[] = [
  {
    title: "Participer à la daily meeting",
    period: "Matinée",
    intensity: 2,
    icon: CalendarClock,
  },
  {
    title: "Vérifier les retours utilisateurs (feedback, support, interviews)",
    period: "Matinée",
    intensity: 3,
    icon: Search,
  },
  {
    title: "Analyser les KPIs UX / Produit",
    period: "Matinée",
    intensity: 4,
    icon: BarChart3,
  },
  {
    title: "Prioriser les tâches dans le backlog",
    period: "Matinée",
    intensity: 5,
    icon: FolderKanban,
  },
  {
    title: "Rédiger ou affiner les user stories",
    period: "Après-midi",
    intensity: 4,
    icon: FilePlus2,
  },
  {
    title: "Créer / mettre à jour les personas",
    period: "Après-midi",
    intensity: 3,
    icon: UserRound,
  },
  {
    title: "Suivre l’avancement des tâches avec l’équipe",
    period: "Après-midi",
    intensity: 4,
    icon: UsersRound,
  },
  {
    title: "Préparer les prochaines améliorations produit",
    period: "Soirée",
    intensity: 4,
    icon: Lightbulb,
  },
];

export default function UserJourneyScrumDiagram() {
  return (
    <div className=" space-y-6">
      <p className="text-sm text-muted-foreground">
        Cette frise illustre une journée type structurée selon les temps forts
        du rôle de PO, entre cadrage, pilotage produit et coordination avec les
        équipes. Chaque étape est positionnée dans le temps (matinée,
        après-midi, soirée) et qualifiée par son intensité perçue, pour mieux
        visualiser la charge quotidienne.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground ">
        <span className="flex items-center gap-1">😣 Très intense</span>
        <span className="flex items-center gap-1">🙁 Intense</span>
        <span className="flex items-center gap-1">😐 Modérée</span>
        <span className="flex items-center gap-1">🙂 Faible</span>
        <span className="flex items-center gap-1">😁 Très faible</span>
      </div>
      <UserJourneyZigZag steps={steps} />
    </div>
  );
}
