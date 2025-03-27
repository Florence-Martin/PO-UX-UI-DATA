import { TaskStoryBase } from "./taskStoryBase";

export interface BacklogTask extends TaskStoryBase {
  id?: string;
  userStoryIds?: string[];
}
