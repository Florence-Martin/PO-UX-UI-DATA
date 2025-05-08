import { useEffect, useState, useCallback } from "react";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { BacklogTask } from "@/lib/types/backlogTask";

export function useTimeline() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [us, s, t] = await Promise.all([
      getAllUserStories(),
      getAllSprints(),
      getAllBacklogTasks(),
    ]);
    setUserStories(us);
    setSprints(s);
    setTasks(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sprints, userStories, tasks, loading, refetch };
}
