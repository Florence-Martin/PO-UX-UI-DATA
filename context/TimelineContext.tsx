// context/TimelineContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { BacklogTask } from "@/lib/types/backlogTask";

interface TimelineContextValue {
  sprints: Sprint[];
  userStories: UserStory[];
  tasks: BacklogTask[];
  loading: boolean;
  refetch: () => Promise<void>;
  refreshOnDemand: () => Promise<void>;
}

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [us, s, t] = await Promise.all([
        getAllUserStories(),
        getAllSprints(),
        getAllBacklogTasks(),
      ]);
      setUserStories(us);
      setSprints(s);
      setTasks(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // alias clair pour appel explicite depuis d'autres composants
  const refreshOnDemand = async () => {
    await refetch();
  };

  return (
    <TimelineContext.Provider
      value={{ sprints, userStories, tasks, loading, refetch, refreshOnDemand }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
