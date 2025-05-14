// types/workItemBase.ts
import { Timestamp } from "firebase/firestore";

export interface TaskStoryBase {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyPoints: number;
  status: "todo" | "in-progress" | "done" | "in-testing";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
