import { Timestamp } from "firebase/firestore";

export interface RoadmapQuarter {
  id: string;
  title: string;
  icon: string;
  iconColor: string; //
  userStory: string;
  status: "done" | "in-progress" | "upcoming";
  items: Array<{
    label: string;
    description: string;
  }>;
  userStoryIds?: string[]; // Liste des IDs des user stories liées dans le backlog
  taskIds?: string[]; // Liste des IDs des tâches liées dans le backlog
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
