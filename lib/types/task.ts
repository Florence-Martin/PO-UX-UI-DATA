import { BaseWorkItem } from "./BaseWorkItem";

export interface Task extends BaseWorkItem {
  id?: string;
  status: "todo" | "in-progress" | "done" | "in-testing";
  userStoryIds?: string[];
}
