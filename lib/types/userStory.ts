// types/userStory.ts
export type MoscowKey = "mustHave" | "shouldHave" | "couldHave" | "wontHave";

import { TaskStoryBase } from "./taskStoryBase";

export interface UserStory extends TaskStoryBase {
  id: string;
  code?: string; // ex: "US-001"
  acceptanceCriteria: string;
  taskIds?: string[];
  moscow?: MoscowKey;
}
