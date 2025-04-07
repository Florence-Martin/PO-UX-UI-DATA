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

const steps = [
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
    <div className=" space-y-12">
      <UserJourneyZigZag steps={steps} />
    </div>
  );
}
