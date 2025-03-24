import { Timestamp } from "firebase/firestore";

export interface UserStory {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  storyPoints: number;
  acceptanceCriteria: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
