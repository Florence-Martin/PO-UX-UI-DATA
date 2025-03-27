import { Timestamp } from "firebase/firestore";

export interface BacklogTask {
  id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyPoints: number;
  status: "todo" | "in-progress" | "in-testing" | "done";
  userStoryIds?: string[]; // Lien vers la user story concernée
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
