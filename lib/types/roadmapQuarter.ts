import { Timestamp } from "firebase/firestore";

export interface RoadmapQuarter {
  id: string; // ex: "q1-2025"
  title: string; // ex: "Q1 2025 : Cadrage UX & Structuration"
  icon: string; // ex: "Check" (Lucide)
  iconColor: string; // ex: "text-green-500"
  userStory: string; // ex: "En tant que PO..."
  status: "done" | "in-progress" | "upcoming";
  items: Array<{
    label: string;
    description: string;
  }>;
  taskIds?: string[]; // Liste des IDs des tâches liées dans le backlog
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
