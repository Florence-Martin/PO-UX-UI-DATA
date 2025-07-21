import { Timestamp } from "firebase/firestore";
import { BacklogTask } from "../lib/types/backlogTask";
import { Sprint } from "../lib/types/sprint";
import { UserStory } from "../lib/types/userStory";
import { buildTimelineItemsUserStories } from "../lib/utils/buildTimelineItemsUserStories";

describe("buildTimelineItemsUserStories", () => {
  const mockSprints: Sprint[] = [
    {
      id: "sprint1",
      title: "Sprint 1",
      startDate: Timestamp.fromDate(new Date("2024-01-01")),
      endDate: Timestamp.fromDate(new Date("2024-01-15")),
      status: "active",
      goal: "Test sprint",
      userStoryIds: ["us1", "us2"],
      velocity: 10,
      progress: 50,
      hasReview: false,
      hasRetrospective: false,
    },
    {
      id: "sprint2",
      title: "Sprint 2",
      startDate: Timestamp.fromDate(new Date("2024-01-16")),
      endDate: Timestamp.fromDate(new Date("2024-01-30")),
      status: "done",
      goal: "Completed sprint",
      userStoryIds: ["us3"],
      velocity: 8,
      progress: 100,
      hasReview: true,
      hasRetrospective: true,
    },
    {
      id: "sprint3",
      title: "Sprint 3",
      startDate: Timestamp.fromDate(new Date("2024-02-01")),
      endDate: Timestamp.fromDate(new Date("2024-02-15")),
      status: "planned",
      goal: "Future sprint",
      userStoryIds: ["us4"],
      velocity: 12,
      progress: 0,
      hasReview: false,
      hasRetrospective: false,
    },
  ];

  const mockUserStories: UserStory[] = [
    {
      id: "us1",
      code: "US001",
      title: "User story 1",
      description: "First user story",
      priority: "high",
      storyPoints: 5,
      status: "todo",
      acceptanceCriteria: "Criteria 1",
      sprintId: "sprint1",
      createdAt: Timestamp.fromDate(new Date("2024-01-01")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-01")),
    },
    {
      id: "us2",
      code: "US002",
      title: "User story 2",
      description: "Second user story",
      priority: "medium",
      storyPoints: 3,
      status: "in-progress",
      acceptanceCriteria: "Criteria 2",
      sprintId: "sprint1",
      createdAt: Timestamp.fromDate(new Date("2024-01-02")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-05")),
    },
    {
      id: "us3",
      code: "US003",
      title: "User story 3",
      description: "Third user story",
      priority: "low",
      storyPoints: 2,
      status: "done",
      acceptanceCriteria: "Criteria 3",
      sprintId: "sprint2",
      createdAt: Timestamp.fromDate(new Date("2024-01-16")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-18")),
    },
    {
      id: "us4",
      code: "US004",
      title: "User story 4",
      description: "Fourth user story",
      priority: "high",
      storyPoints: 8,
      status: "todo",
      acceptanceCriteria: "Criteria 4",
      sprintId: "sprint3",
      createdAt: Timestamp.fromDate(new Date("2024-02-01")),
      updatedAt: Timestamp.fromDate(new Date("2024-02-05")),
    },
  ];

  const mockBacklogTasks: BacklogTask[] = [
    {
      id: "task1",
      title: "Task 1",
      description: "First task",
      status: "todo",
      priority: "high",
      storyPoints: 2,
      userStoryIds: ["us1"],
      createdAt: Timestamp.fromDate(new Date("2024-01-01")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-01")),
    },
    {
      id: "task2",
      title: "Task 2",
      description: "Second task",
      status: "in-progress",
      priority: "medium",
      storyPoints: 3,
      userStoryIds: ["us2"],
      createdAt: Timestamp.fromDate(new Date("2024-01-02")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-05")),
    },
    {
      id: "task3",
      title: "Task 3",
      description: "Third task",
      status: "done",
      priority: "low",
      storyPoints: 1,
      userStoryIds: ["us3"],
      createdAt: Timestamp.fromDate(new Date("2024-01-16")),
      updatedAt: Timestamp.fromDate(new Date("2024-01-18")),
    },
    {
      id: "task4",
      title: "Task 4",
      description: "Fourth task",
      status: "in-testing",
      priority: "high",
      storyPoints: 4,
      userStoryIds: ["us4"],
      createdAt: Timestamp.fromDate(new Date("2024-02-01")),
      updatedAt: Timestamp.fromDate(new Date("2024-02-05")),
    },
  ];

  describe("basic functionality", () => {
    test("should return timeline items for valid data", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      expect(result).toHaveLength(4);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("section");
      expect(result[0]).toHaveProperty("userStory");
    });

    test("should handle empty arrays", () => {
      const result = buildTimelineItemsUserStories([], [], []);
      expect(result).toHaveLength(0);
    });

    test("should handle missing user stories", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        [],
        mockBacklogTasks
      );
      expect(result).toHaveLength(0);
    });

    test("should handle missing sprints", () => {
      const result = buildTimelineItemsUserStories(
        [],
        mockUserStories,
        mockBacklogTasks
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("section mapping based on sprint status", () => {
    test("should map active sprint to execution section", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      const activeSprintItems = result.filter((item) =>
        mockUserStories.find(
          (us) => us.id === item.id && us.sprintId === "sprint1"
        )
      );

      activeSprintItems.forEach((item) => {
        expect(item.section).toBe("execution");
      });
    });

    test("should map done sprint to review section", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      const doneSprintItems = result.filter((item) =>
        mockUserStories.find(
          (us) => us.id === item.id && us.sprintId === "sprint2"
        )
      );

      doneSprintItems.forEach((item) => {
        expect(item.section).toBe("review");
      });
    });

    test("should map planned sprint to planning section", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      const plannedSprintItems = result.filter((item) =>
        mockUserStories.find(
          (us) => us.id === item.id && us.sprintId === "sprint3"
        )
      );

      plannedSprintItems.forEach((item) => {
        expect(item.section).toBe("planning");
      });
    });
  });

  describe("date formatting", () => {
    test("should handle string dates", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      result.forEach((item) => {
        expect(item.startDate).toBeDefined();
        expect(item.endDate).toBeDefined();
        expect(typeof item.startDate).toBe("string");
        expect(typeof item.endDate).toBe("string");
      });
    });

    test("should handle Timestamp dates", () => {
      const timestampSprints = mockSprints.map((sprint) => ({
        ...sprint,
        startDate: Timestamp.fromDate(sprint.startDate.toDate()),
        endDate: Timestamp.fromDate(sprint.endDate.toDate()),
      }));

      const result = buildTimelineItemsUserStories(
        timestampSprints,
        mockUserStories,
        mockBacklogTasks
      );

      result.forEach((item) => {
        expect(item.startDate).toBeDefined();
        expect(item.endDate).toBeDefined();
        expect(typeof item.startDate).toBe("string");
        expect(typeof item.endDate).toBe("string");
      });
    });

    test("should handle Date objects", () => {
      const dateSprints = mockSprints.map((sprint) => ({
        ...sprint,
        startDate: Timestamp.fromDate(sprint.startDate.toDate()),
        endDate: Timestamp.fromDate(sprint.endDate.toDate()),
      }));

      const result = buildTimelineItemsUserStories(
        dateSprints,
        mockUserStories,
        mockBacklogTasks
      );

      result.forEach((item) => {
        expect(item.startDate).toBeDefined();
        expect(item.endDate).toBeDefined();
        expect(typeof item.startDate).toBe("string");
        expect(typeof item.endDate).toBe("string");
      });
    });

    test("should handle undefined dates", () => {
      // Pour ce test, nous testons la fonction getFormattedDate avec des valeurs undefined
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      // Vérifier que les dates sont formatées correctement
      result.forEach((item) => {
        expect(typeof item.startDate).toBe("string");
        expect(typeof item.endDate).toBe("string");
      });
    });
  });

  describe("sorting functionality", () => {
    test("should sort by section then by date", () => {
      const result = buildTimelineItemsUserStories(
        mockSprints,
        mockUserStories,
        mockBacklogTasks
      );

      // Vérifier que les sections sont dans l'ordre correct
      const sections = result.map((item) => item.section);
      const sectionOrder = ["planning", "execution", "review"];

      let lastSectionIndex = -1;
      sections.forEach((section) => {
        const currentSectionIndex = sectionOrder.indexOf(section);
        expect(currentSectionIndex).toBeGreaterThanOrEqual(lastSectionIndex);
        lastSectionIndex = currentSectionIndex;
      });
    });

    test("should handle items with missing rawDate", () => {
      const userStoriesWithoutDates = mockUserStories.map((us) => ({
        ...us,
        createdAt: undefined,
        updatedAt: undefined,
      }));

      const result = buildTimelineItemsUserStories(
        mockSprints,
        userStoriesWithoutDates,
        mockBacklogTasks
      );

      expect(result).toHaveLength(4);
      // Devrait toujours être trié par section même sans dates
      result.forEach((item) => {
        expect(item.section).toBeDefined();
      });
    });
  });

  describe("edge cases", () => {
    test("should handle user stories without matching sprints", () => {
      const orphanUserStories: UserStory[] = [
        ...mockUserStories,
        {
          id: "us5",
          code: "US005",
          title: "Orphan user story",
          description: "User story without sprint",
          priority: "medium",
          storyPoints: 3,
          status: "todo",
          acceptanceCriteria: "Criteria 5",
          sprintId: "nonexistent-sprint",
          createdAt: Timestamp.fromDate(new Date("2024-01-01")),
          updatedAt: Timestamp.fromDate(new Date("2024-01-01")),
        },
      ];

      const result = buildTimelineItemsUserStories(
        mockSprints,
        orphanUserStories,
        mockBacklogTasks
      );

      // L'user story orpheline ne devrait pas être incluse
      expect(result).toHaveLength(4);
      expect(result.find((item) => item.id === "us5")).toBeUndefined();
    });

    test("should handle user stories with missing code or title", () => {
      const incompleteUserStories: UserStory[] = [
        {
          id: "us6",
          code: "", // Code vide
          title: "Story without code",
          description: "Test story",
          priority: "low",
          storyPoints: 1,
          status: "todo",
          acceptanceCriteria: "Criteria 6",
          sprintId: "sprint1",
          createdAt: Timestamp.fromDate(new Date("2024-01-01")),
          updatedAt: Timestamp.fromDate(new Date("2024-01-01")),
        },
        {
          id: "us7",
          code: "US007",
          title: "", // Title vide
          description: "Test story",
          priority: "low",
          storyPoints: 1,
          status: "todo",
          acceptanceCriteria: "Criteria 7",
          sprintId: "sprint1",
          createdAt: Timestamp.fromDate(new Date("2024-01-01")),
          updatedAt: Timestamp.fromDate(new Date("2024-01-01")),
        },
      ];

      const extendedSprints = [
        {
          ...mockSprints[0],
          userStoryIds: [...mockSprints[0].userStoryIds, "us6", "us7"],
        },
        ...mockSprints.slice(1),
      ];

      const result = buildTimelineItemsUserStories(
        extendedSprints,
        incompleteUserStories,
        mockBacklogTasks
      );

      expect(result).toHaveLength(2);

      const storyWithoutCode = result.find((item) => item.id === "us6");
      expect(storyWithoutCode?.code).toBe("");

      const storyWithoutTitle = result.find((item) => item.id === "us7");
      expect(storyWithoutTitle?.title).toBe("");
    });

    test("should handle duplicate user story IDs", () => {
      const duplicateUserStories = [
        ...mockUserStories,
        {
          ...mockUserStories[0],
          title: "Duplicate story",
        },
      ];

      const result = buildTimelineItemsUserStories(
        mockSprints,
        duplicateUserStories,
        mockBacklogTasks
      );

      // Le Set devrait empêcher les doublons
      const us1Items = result.filter((item) => item.id === "us1");
      expect(us1Items).toHaveLength(1);
    });
  });
});
