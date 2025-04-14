// types/userStory.ts

import { TaskStoryBase } from "./taskStoryBase";

export type MoscowKey =
  | "mustHave"
  | "shouldHave"
  | "couldHave"
  | "wontHave"
  | "";

export interface UserStory extends TaskStoryBase {
  id: string;
  code?: string; // ex: "US-001"
  acceptanceCriteria: string;
  taskIds?: string[];
  moscow?: MoscowKey;
}
