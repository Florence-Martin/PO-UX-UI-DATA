import { BaseWorkItem } from "./BaseWorkItem";

export interface BacklogTask extends BaseWorkItem {
  id?: string;
  status: "todo" | "in-progress" | "done" | "in-testing";
  userStoryIds?: string[];
  badge?: "sprint" | "" | null;
}
