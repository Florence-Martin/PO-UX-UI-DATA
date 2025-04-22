import { Timestamp } from "firebase/firestore";

export interface Sprint {
  id: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  userStoryIds: string[]; // US assignées
  velocity: number; // Total des storyPoints
  progress: number; // % de progression, à calculer dynamiquement
  status: "planned" | "active" | "done"; // Statut du sprint
}
