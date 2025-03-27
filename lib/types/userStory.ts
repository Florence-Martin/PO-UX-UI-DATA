// types/userStory.ts

import { TaskStoryBase } from "./taskStoryBase";

export interface UserStory extends TaskStoryBase {
  id?: string;
  acceptanceCriteria: string;
  taskIds?: string[];
}
