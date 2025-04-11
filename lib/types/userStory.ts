// types/userStory.ts

import { TaskStoryBase } from "./taskStoryBase";

export interface UserStory extends TaskStoryBase {
  id?: string;
  code?: string; // ex: "US-001"
  acceptanceCriteria: string;
  taskIds?: string[];
  moscow?: "mustHave" | "shouldHave" | "couldHave" | "wontHave";
}
