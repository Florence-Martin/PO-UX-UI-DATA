import { Timestamp } from "firebase/firestore";

export interface RoadmapQuarter {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  status: "done" | "in-progress" | "upcoming";

  productVision: string;

  // Objectifs concrets (pas modifiables une fois créés)
  items: Array<{
    label: string;
    description: string;
  }>;

  // Lien vers les entités du backlog (user stories + tasks)
  userStoryIds?: string[];
  taskIds?: string[];

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
