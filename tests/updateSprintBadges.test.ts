import { updateBadgesForSprintUserStories } from "../lib/utils/updateSprintBadges";
import {
  getAllBacklogTasks,
  updateBacklogTask,
} from "../lib/services/backlogTasksService";

// Mock des services
jest.mock("@/lib/services/backlogTasksService", () => ({
  getAllBacklogTasks: jest.fn(),
  updateBacklogTask: jest.fn(),
}));

describe("updateBadgesForSprintUserStories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devrait ajouter le badge 'sprint' aux tâches liées aux user stories du sprint", async () => {
    // ARRANGE
    const mockTasks = [
      {
        id: "task1",
        title: "Task 1",
        description: "Description 1",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us1", "us2"],
        badge: null,
      },
      {
        id: "task2",
        title: "Task 2",
        description: "Description 2",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us3"],
        badge: null,
      },
      {
        id: "task3",
        title: "Task 3",
        description: "Description 3",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us1"],
        badge: "sprint", // Déjà avec un badge
      },
    ];

    (getAllBacklogTasks as jest.Mock).mockResolvedValue(mockTasks);
    (updateBacklogTask as jest.Mock).mockResolvedValue({});

    // ACT
    await updateBadgesForSprintUserStories(["us1", "us2"]);

    // ASSERT
    expect(getAllBacklogTasks).toHaveBeenCalledTimes(1);

    // La task1 devrait recevoir un badge
    expect(updateBacklogTask).toHaveBeenCalledWith(
      "task1",
      expect.objectContaining({
        badge: "sprint",
      })
    );

    // La task2 n'a pas d'US liée au sprint, ne devrait pas avoir de badge
    expect(updateBacklogTask).not.toHaveBeenCalledWith(
      "task2",
      expect.any(Object)
    );

    // La task3 a déjà un badge et a une US liée, ne devrait pas être mise à jour
    expect(updateBacklogTask).not.toHaveBeenCalledWith(
      "task3",
      expect.any(Object)
    );
  });

  test("devrait supprimer le badge 'sprint' des tâches qui ne sont plus liées", async () => {
    // ARRANGE
    const mockTasks = [
      {
        id: "task1",
        title: "Task 1",
        description: "Description 1",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us1"],
        badge: "sprint",
      },
      {
        id: "task2",
        title: "Task 2",
        description: "Description 2",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us3"],
        badge: "sprint", // Badge à supprimer car US non liée
      },
      {
        id: "task3",
        title: "Task 3",
        description: "Description 3",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: [],
        badge: "sprint", // Badge à supprimer car pas d'US
      },
    ];

    (getAllBacklogTasks as jest.Mock).mockResolvedValue(mockTasks);
    (updateBacklogTask as jest.Mock).mockResolvedValue({});

    // ACT
    await updateBadgesForSprintUserStories(["us1", "us2"]);

    // ASSERT
    // task1 reste inchangée (a une US liée et déjà le badge)
    expect(updateBacklogTask).not.toHaveBeenCalledWith(
      "task1",
      expect.any(Object)
    );

    // task2 et task3 doivent perdre leur badge
    expect(updateBacklogTask).toHaveBeenCalledWith(
      "task2",
      expect.objectContaining({
        badge: null,
      })
    );
    expect(updateBacklogTask).toHaveBeenCalledWith(
      "task3",
      expect.objectContaining({
        badge: null,
      })
    );
  });

  test("devrait gérer le cas où aucune tâche n'est liée aux user stories", async () => {
    // ARRANGE
    const mockTasks = [
      {
        id: "task1",
        title: "Task 1",
        description: "Description 1",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us3", "us4"],
        badge: null,
      },
      {
        id: "task2",
        title: "Task 2",
        description: "Description 2",
        priority: "medium",
        storyPoints: 3,
        userStoryIds: ["us5"],
        badge: "sprint",
      },
    ];

    (getAllBacklogTasks as jest.Mock).mockResolvedValue(mockTasks);
    (updateBacklogTask as jest.Mock).mockResolvedValue({});

    // ACT
    await updateBadgesForSprintUserStories(["us1", "us2"]);

    // ASSERT
    // task1 reste inchangée (pas de badge à ajouter)
    expect(updateBacklogTask).not.toHaveBeenCalledWith(
      "task1",
      expect.any(Object)
    );

    // task2 doit perdre son badge car aucune US liée
    expect(updateBacklogTask).toHaveBeenCalledWith(
      "task2",
      expect.objectContaining({
        badge: null,
      })
    );
  });

  test("devrait gérer le cas où une tâche n'a pas de userStoryIds", async () => {
    // ARRANGE
    const mockTasks = [
      {
        id: "task1",
        title: "Task 1",
        description: "Description 1",
        priority: "medium",
        storyPoints: 3,
        // Pas de userStoryIds
        badge: "sprint",
      },
    ];

    (getAllBacklogTasks as jest.Mock).mockResolvedValue(mockTasks);
    (updateBacklogTask as jest.Mock).mockResolvedValue({});

    // ACT
    await updateBadgesForSprintUserStories(["us1", "us2"]);

    // ASSERT
    // Le badge doit être retiré car pas de userStoryIds
    expect(updateBacklogTask).toHaveBeenCalledWith(
      "task1",
      expect.objectContaining({
        badge: null,
      })
    );
  });

  test("devrait gérer les erreurs de l'API", async () => {
    // ARRANGE
    (getAllBacklogTasks as jest.Mock).mockRejectedValue(new Error("API Error"));

    // ACT & ASSERT
    await expect(updateBadgesForSprintUserStories(["us1"])).rejects.toThrow(
      "API Error"
    );
  });
});
