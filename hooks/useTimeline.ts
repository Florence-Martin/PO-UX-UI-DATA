import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { useCallback, useEffect, useState } from "react";

export function useTimeline() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction sans useCallback pour éviter les cycles infinis
  const fetchData = async () => {
    try {
      setLoading(true);
      const [us, s, t] = await Promise.all([
        getAllUserStories(),
        getAllSprints(),
        getAllBacklogTasks(),
      ]);
      setUserStories(us);
      setSprints(s);
      setTasks(t);
    } catch (error) {
      console.error("Erreur lors du chargement des données timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { sprints, userStories, tasks, loading, refetch };
}
