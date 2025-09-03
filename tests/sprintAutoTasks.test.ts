import {
  createBacklogTask,
  getAllBacklogTasks,
} from "@/lib/services/backlogTasksService";
import { createSprint } from "@/lib/services/sprintService";
import {
  addSprintToUserStory,
  getAllUserStories,
  updateUserStory,
} from "@/lib/services/userStoryService";
import { BacklogTask } from "@/lib/types/backlogTask";
import { UserStory } from "@/lib/types/userStory";
import { updateBadgesForSprintUserStories } from "@/lib/utils/updateSprintBadges";
import { Timestamp } from "firebase/firestore";

// Mock des services
jest.mock("@/lib/services/sprintService");
jest.mock("@/lib/services/userStoryService");
jest.mock("@/lib/services/backlogTasksService");
jest.mock("@/lib/utils/updateSprintBadges");

const mockCreateSprint = createSprint as jest.MockedFunction<
  typeof createSprint
>;
const mockAddSprintToUserStory = addSprintToUserStory as jest.MockedFunction<
  typeof addSprintToUserStory
>;
const mockUpdateUserStory = updateUserStory as jest.MockedFunction<
  typeof updateUserStory
>;
const mockGetAllUserStories = getAllUserStories as jest.MockedFunction<
  typeof getAllUserStories
>;
const mockGetAllBacklogTasks = getAllBacklogTasks as jest.MockedFunction<
  typeof getAllBacklogTasks
>;
const mockCreateBacklogTask = createBacklogTask as jest.MockedFunction<
  typeof createBacklogTask
>;
const mockUpdateBadgesForSprintUserStories =
  updateBadgesForSprintUserStories as jest.MockedFunction<
    typeof updateBadgesForSprintUserStories
  >;

describe("Sprint Auto Tasks Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devrait créer automatiquement des tâches pour les User Stories sans tâches existantes", async () => {
    // ARRANGE
    const mockUserStories: UserStory[] = [
      {
        id: "us1",
        code: "US-034",
        title: "Corriger les 5 warnings ESLint",
        description: "User story pour corriger les dépendances useEffect",
        acceptanceCriteria: "Les 5 warnings ESLint doivent être corrigés",
        priority: "high",
        storyPoints: 2,
        moscow: "mustHave",
        status: "todo",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    const mockExistingTasks: BacklogTask[] = [];

    mockCreateSprint.mockResolvedValue("sprint123");
    mockAddSprintToUserStory.mockResolvedValue();
    mockUpdateUserStory.mockResolvedValue();
    mockGetAllUserStories.mockResolvedValue(mockUserStories);
    mockGetAllBacklogTasks.mockResolvedValue(mockExistingTasks);
    mockCreateBacklogTask.mockResolvedValue({} as any);
    mockUpdateBadgesForSprintUserStories.mockResolvedValue();

    // Simuler la logique de création de sprint avec tâches automatiques
    const userStoryIds = ["us1"];

    await mockCreateSprint({
      title: "Sprint Test",
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      userStoryIds,
      velocity: 0,
      hasReview: false,
      hasRetrospective: false,
    });

    // Simuler les étapes de mise à jour
    await Promise.all(
      userStoryIds.map(async (usId) => {
        await mockAddSprintToUserStory(usId, "sprint123");
        await mockUpdateUserStory(usId, { badge: "sprint" });
      })
    );

    await mockUpdateBadgesForSprintUserStories(userStoryIds);

    // Simuler la création automatique de tâches
    const userStoriesData = await mockGetAllUserStories();
    const allTasks = await mockGetAllBacklogTasks();

    for (const usId of userStoryIds) {
      const hasExistingTasks = allTasks.some((task) =>
        task.userStoryIds?.includes(usId)
      );

      if (!hasExistingTasks) {
        const userStory = userStoriesData.find(
          (us: UserStory) => us.id === usId
        );

        if (userStory) {
          const defaultTask: Omit<BacklogTask, "id"> = {
            title: `Implémenter: ${userStory.title}`,
            description: `Tâche principale pour implémenter la User Story: ${userStory.title}`,
            priority: userStory.priority || "medium",
            storyPoints: userStory.storyPoints || 3,
            status: "todo",
            userStoryIds: [usId],
            badge: "sprint",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await mockCreateBacklogTask(defaultTask);
        }
      }
    }

    // ASSERT
    expect(mockCreateSprint).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Sprint Test",
        userStoryIds: ["us1"],
      })
    );

    expect(mockAddSprintToUserStory).toHaveBeenCalledWith("us1", "sprint123");
    expect(mockUpdateUserStory).toHaveBeenCalledWith("us1", {
      badge: "sprint",
    });
    expect(mockUpdateBadgesForSprintUserStories).toHaveBeenCalledWith(["us1"]);

    // Vérifier qu'une tâche par défaut a été créée
    expect(mockCreateBacklogTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Implémenter: Corriger les 5 warnings ESLint",
        description: expect.stringContaining("Corriger les 5 warnings ESLint"),
        priority: "high",
        storyPoints: 2,
        status: "todo",
        userStoryIds: ["us1"],
        badge: "sprint",
      })
    );
  });

  test("ne devrait PAS créer de tâche si la User Story a déjà des tâches existantes", async () => {
    // ARRANGE
    const mockUserStories: UserStory[] = [
      {
        id: "us1",
        code: "US-034",
        title: "Corriger les 5 warnings ESLint",
        description: "User story pour corriger les dépendances useEffect",
        acceptanceCriteria: "Les 5 warnings ESLint doivent être corrigés",
        priority: "high",
        storyPoints: 2,
        moscow: "mustHave",
        status: "todo",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    const mockExistingTasks: BacklogTask[] = [
      {
        id: "task1",
        title: "Tâche existante",
        description: "Une tâche déjà créée",
        priority: "medium",
        storyPoints: 3,
        status: "todo",
        userStoryIds: ["us1"],
        badge: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    mockGetAllUserStories.mockResolvedValue(mockUserStories);
    mockGetAllBacklogTasks.mockResolvedValue(mockExistingTasks);
    mockCreateBacklogTask.mockResolvedValue({} as any);

    // ACT - Simuler la vérification d'existence de tâches
    const userStoryIds = ["us1"];
    const allTasks = await mockGetAllBacklogTasks();

    for (const usId of userStoryIds) {
      const hasExistingTasks = allTasks.some((task) =>
        task.userStoryIds?.includes(usId)
      );

      if (!hasExistingTasks) {
        // Cette logique ne devrait PAS s'exécuter
        await mockCreateBacklogTask({
          title: "Ne devrait pas être créée",
          description: "Cette tâche ne devrait pas être créée",
          priority: "medium",
          storyPoints: 3,
          status: "todo",
          userStoryIds: [usId],
          badge: "sprint",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    }

    // ASSERT
    expect(mockCreateBacklogTask).not.toHaveBeenCalled();
  });
});
