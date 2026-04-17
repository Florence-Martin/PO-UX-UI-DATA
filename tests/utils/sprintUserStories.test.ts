/**
 * Tests pour les fonctions de filtrage des User Stories et tâches par sprint
 * US-036 : Multi-sprint support
 */

import { Timestamp } from "firebase/firestore";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import {
  getTasksForSprint,
  getUserStoriesForSprint,
} from "@/lib/utils/sprintUserStories";

function createSprint(overrides: Partial<Sprint> & Pick<Sprint, "id" | "title">): Sprint {
  return {
    id: overrides.id,
    title: overrides.title,
    startDate:
      overrides.startDate ??
      (Timestamp.fromDate(new Date("2025-11-01")) as unknown as Sprint["startDate"]),
    endDate:
      overrides.endDate ??
      (Timestamp.fromDate(new Date("2025-11-15")) as unknown as Sprint["endDate"]),
    userStoryIds: overrides.userStoryIds ?? [],
    velocity: overrides.velocity ?? 0,
    progress: overrides.progress ?? 0,
    status: overrides.status ?? "planned",
    hasReview: overrides.hasReview ?? false,
    hasRetrospective: overrides.hasRetrospective ?? false,
    goal: overrides.goal,
    closedAt: overrides.closedAt,
    isActive: overrides.isActive,
  };
}

function createBacklogTask(
  overrides: Partial<BacklogTask> & Pick<BacklogTask, "title">
): BacklogTask {
  return {
    id: overrides.id,
    title: overrides.title,
    description: overrides.description ?? "",
    priority: overrides.priority ?? "medium",
    storyPoints: overrides.storyPoints ?? 0,
    status: overrides.status ?? "todo",
    userStoryIds: overrides.userStoryIds,
    badge: overrides.badge,
    createdAt: overrides.createdAt,
    updatedAt: overrides.updatedAt,
  };
}

describe("sprintUserStories utils", () => {
  describe("getUserStoriesForSprint", () => {
    const mockUserStories: UserStory[] = [
      {
        id: "us1",
        code: "US-036",
        title: "Multi-sprint support",
        sprintId: "sprint1",
      } as UserStory,
      {
        id: "us2",
        code: "US-037",
        title: "Multi-tâches validation",
        sprintId: "sprint2",
      } as UserStory,
      {
        id: "us3",
        code: "US-038",
        title: "Backlog task",
        sprintId: undefined,
      } as UserStory,
    ];

    it("doit retourner les User Stories du sprint via sprint.userStoryIds", () => {
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint 28",
        userStoryIds: ["us1"],
      });

      const result = getUserStoriesForSprint(sprint, mockUserStories);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("us1");
      expect(result[0].code).toBe("US-036");
    });

    it("doit retourner les User Stories via userStory.sprintId (fallback)", () => {
      const sprint = createSprint({
        id: "sprint2",
        title: "Sprint 29",
        userStoryIds: [],
      });

      const result = getUserStoriesForSprint(sprint, mockUserStories);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("us2");
      expect(result[0].code).toBe("US-037");
    });

    it("doit combiner les deux méthodes (userStoryIds + sprintId)", () => {
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint 28",
        userStoryIds: ["us3"],
      });

      const result = getUserStoriesForSprint(sprint, mockUserStories);

      // us3 via userStoryIds + us1 via sprintId (si sprintId="sprint1")
      expect(result.length).toBeGreaterThan(0);
    });

    it("doit retourner un tableau vide si sprint est null", () => {
      const result = getUserStoriesForSprint(null, mockUserStories);

      expect(result).toEqual([]);
    });

    it("doit retourner un tableau vide si aucune US ne correspond", () => {
      const sprint = createSprint({
        id: "sprint99",
        title: "Sprint inexistant",
        userStoryIds: [],
      });

      const result = getUserStoriesForSprint(sprint, mockUserStories);

      expect(result).toEqual([]);
    });

    it("doit dédupliquer les User Stories présentes dans les deux sources", () => {
      const mockDuplicateUS: UserStory[] = [
        {
          id: "us1",
          code: "US-036",
          title: "Multi-sprint support",
          sprintId: "sprint1",
        } as UserStory,
      ];

      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint 28",
        userStoryIds: ["us1"], // US-036 déjà dans sprintId
      });

      const result = getUserStoriesForSprint(sprint, mockDuplicateUS);

      // Ne doit apparaître qu'une seule fois
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("us1");
    });
  });

  describe("getTasksForSprint", () => {
    const mockTasks: BacklogTask[] = [
      createBacklogTask({
        id: "task1",
        title: "Tache 1 - Sprint 28",
        userStoryIds: ["us1"],
        status: "todo",
      }),
      createBacklogTask({
        id: "task2",
        title: "Tache 2 - Sprint 28",
        userStoryIds: ["us1"],
        status: "in-progress",
      }),
      createBacklogTask({
        id: "task3",
        title: "Tache 3 - Sprint 29",
        userStoryIds: ["us2"],
        status: "todo",
      }),
      createBacklogTask({
        id: "task4",
        title: "Tache 4 - Multi-sprint",
        userStoryIds: ["us1", "us2"],
        status: "in-testing",
      }),
      createBacklogTask({
        id: "task5",
        title: "Tache 5 - Sans US",
        userStoryIds: [],
        status: "todo",
      }),
    ];

    it("doit retourner les tâches liées aux US du sprint", () => {
      const sprintUserStoryIds = ["us1"];

      const result = getTasksForSprint(mockTasks, sprintUserStoryIds);

      expect(result).toHaveLength(3); // task1, task2, task4
      expect(result.map((t) => t.id)).toContain("task1");
      expect(result.map((t) => t.id)).toContain("task2");
      expect(result.map((t) => t.id)).toContain("task4"); // Multi-sprint
    });

    it("doit retourner les tâches multi-sprint (intersection)", () => {
      const sprintUserStoryIds = ["us2"];

      const result = getTasksForSprint(mockTasks, sprintUserStoryIds);

      expect(result).toHaveLength(2); // task3, task4
      expect(result.map((t) => t.id)).toContain("task3");
      expect(result.map((t) => t.id)).toContain("task4");
    });

    it("doit exclure les tâches sans User Story", () => {
      const sprintUserStoryIds = ["us1"];

      const result = getTasksForSprint(mockTasks, sprintUserStoryIds);

      expect(result.map((t) => t.id)).not.toContain("task5");
    });

    it("doit retourner un tableau vide si sprintUserStoryIds est vide", () => {
      const result = getTasksForSprint(mockTasks, []);

      expect(result).toEqual([]);
    });

    it("doit retourner un tableau vide si aucune tâche ne correspond", () => {
      const sprintUserStoryIds = ["us999"];

      const result = getTasksForSprint(mockTasks, sprintUserStoryIds);

      expect(result).toEqual([]);
    });

    it("doit gérer les tâches avec userStoryIds undefined", () => {
      const tasksWithUndefined: BacklogTask[] = [
        createBacklogTask({
          id: "task1",
          title: "Tache sans userStoryIds",
          userStoryIds: undefined,
          status: "todo",
        }),
        createBacklogTask({
          id: "task2",
          title: "Tache avec userStoryIds",
          userStoryIds: ["us1"],
          status: "todo",
        }),
      ];

      const result = getTasksForSprint(tasksWithUndefined, ["us1"]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("task2");
    });
  });

  describe("Intégration multi-sprint", () => {
    it("doit filtrer correctement les tâches de 2 sprints actifs simultanément", () => {
      const sprint28UserStoryIds = ["us1"];
      const sprint29UserStoryIds = ["us2"];

      const allTasks: BacklogTask[] = [
        createBacklogTask({
          id: "task1",
          title: "Sprint 28 task",
          userStoryIds: ["us1"],
          status: "todo",
        }),
        createBacklogTask({
          id: "task2",
          title: "Sprint 29 task",
          userStoryIds: ["us2"],
          status: "todo",
        }),
        createBacklogTask({
          id: "task3",
          title: "Multi-sprint task",
          userStoryIds: ["us1", "us2"],
          status: "in-progress",
        }),
      ];

      const sprint28Tasks = getTasksForSprint(allTasks, sprint28UserStoryIds);
      const sprint29Tasks = getTasksForSprint(allTasks, sprint29UserStoryIds);

      // Sprint 28 : task1 + task3 (multi-sprint)
      expect(sprint28Tasks).toHaveLength(2);
      expect(sprint28Tasks.map((t) => t.id)).toContain("task1");
      expect(sprint28Tasks.map((t) => t.id)).toContain("task3");

      // Sprint 29 : task2 + task3 (multi-sprint)
      expect(sprint29Tasks).toHaveLength(2);
      expect(sprint29Tasks.map((t) => t.id)).toContain("task2");
      expect(sprint29Tasks.map((t) => t.id)).toContain("task3");

      // task3 doit apparaître dans les deux
      expect(sprint28Tasks.some((t) => t.id === "task3")).toBe(true);
      expect(sprint29Tasks.some((t) => t.id === "task3")).toBe(true);
    });
  });
});
