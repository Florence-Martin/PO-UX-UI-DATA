import { TaskStoryBase } from "./taskStoryBase";

export interface Task extends TaskStoryBase {
  id?: string;
  userStoryIds?: string[];
}
