import { BaseWorkItem } from "./BaseWorkItem";

export type MoscowKey =
  | "mustHave"
  | "shouldHave"
  | "couldHave"
  | "wontHave"
  | "";

export interface UserStory extends BaseWorkItem {
  id: string;
  code?: string;
  acceptanceCriteria: string;
  taskIds?: string[];
  moscow?: MoscowKey | null;
  sprintId?: string;
  badge?: "sprint" | "" | null;
}
