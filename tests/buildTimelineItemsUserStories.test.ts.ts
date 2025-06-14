import { buildTimelineItemsUserStories } from "../lib/utils/buildTimelineItemsUserStories";
import { Sprint } from "../lib/types/sprint";
import { UserStory } from "../lib/types/userStory";
import { BacklogTask } from "../lib/types/backlogTask";
import { Timestamp } from "firebase/firestore";
import { formatDateToFrenchString } from "../lib/utils/formatDateToFrenchString";

// Mock de la fonction formatDateToFrenchString
jest.mock("../lib/utils/formatDateToFrenchString", () => ({
  formatDateToFrenchString: jest.fn((date) => `formatted_${date}`),
}));

describe("buildTimelineItemsUserStories", () => {
  // Dates constantes pour les tests
  const date1 = new Date("2023-01-10");
  const date2 = new Date("2023-01-20");
  const date3 = new Date("2023-01-30");

  // Création de données de test respectant les types exacts
  const createSprint = (
    id: string,
    status: "planned" | "active" | "done",
    startDate?: Date
  ): Sprint => ({
    id,
    title: `Sprint ${id}`,
    status,
    startDate: startDate
      ? Timestamp.fromDate(startDate)
      : Timestamp.fromDate(new Date()),
    endDate: startDate
      ? Timestamp.fromDate(new Date(startDate.getTime() + 86400000 * 14))
      : Timestamp.fromDate(new Date()),
    userStoryIds: [`us-${id}`], // Chaque sprint a une US associée
    velocity: 10,
    progress: 50,
    hasReview: false,
    hasRetrospective: false,
    goal: `Goal for Sprint ${id}`,
  });

  const createUserStory = (
    id: string,
    sprintId?: string,
    createdAt?: Date
  ): UserStory => ({
    id,
    code: `US-${id}`,
    title: `User Story ${id}`,
    description: `Description of User Story ${id}`,
    priority: "medium",
    storyPoints: 5,
    acceptanceCriteria: "Criteria for US",
    sprintId,
    createdAt: createdAt
      ? Timestamp.fromDate(createdAt)
      : Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    moscow: "mustHave",
    badge: "sprint",
  });

  const createTask = (
    id: string,
    userStoryIds: string[],
    status: "todo" | "in-progress" | "done" | "in-testing"
  ): BacklogTask => ({
    id,
    status,
    title: `Task ${id}`,
    description: `Description of task ${id}`,
    badge: "sprint", // Pour que la tâche soit considérée comme de sprint
    userStoryIds,
    priority: "medium",
    storyPoints: 3,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });

  beforeEach(() => {
    (formatDateToFrenchString as jest.Mock).mockClear();
  });

  test("devrait retourner un tableau vide si aucune donnée n'est fournie", () => {
    const items = buildTimelineItemsUserStories([], [], []);
    expect(items).toEqual([]);
  });

  test("devrait créer des items à partir des tâches de backlog liées à des US", () => {
    const sprints = [createSprint("1", "active", date1)];
    const userStories = [createUserStory("us-1", "1", date1)];
    const tasks = [createTask("task-1", ["us-1"], "in-progress")];

    const items = buildTimelineItemsUserStories(sprints, userStories, tasks);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "us-1",
      title: "User Story us-1",
      code: "US-us-1",
      section: "execution", // Correspondra au résultat de mapTaskStatusToSection
    });
  });

  test("devrait ignorer les tâches qui ne sont pas liées à un sprint", () => {
    const sprints = [createSprint("1", "active", date1)];
    const userStories = [createUserStory("us-1", "1", date1)];
    const tasks = [
      createTask("task-1", ["us-1"], "in-progress"),
      createTask("task-2", ["us-2"], "todo"),
    ];
    // Modifier la deuxième tâche pour ne pas être une tâche de sprint
    const nonSprintTask = { ...tasks[1], badge: null };
    tasks[1] = nonSprintTask;

    const items = buildTimelineItemsUserStories(sprints, userStories, tasks);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("us-1");
  });

  test("devrait ajouter des US liées à un sprint même si elles ne sont pas référencées par une tâche", () => {
    const sprints = [
      createSprint("1", "active", date1),
      createSprint("2", "done", date2),
    ];
    const userStories = [
      createUserStory("us-1", "1", date1),
      createUserStory("us-2", "2", date2),
      createUserStory("us-3", undefined, date3), // Sans sprintId
    ];
    const tasks: BacklogTask[] = []; // Aucune tâche

    const items = buildTimelineItemsUserStories(sprints, userStories, tasks);

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.id)).toEqual(["us-1", "us-2"]);
    expect(items.find((i) => i.id === "us-1")?.section).toBe("execution");
    expect(items.find((i) => i.id === "us-2")?.section).toBe("review");
  });

  test("devrait affecter la bonne section en fonction du statut de la tâche ou du sprint", () => {
    const sprints = [
      createSprint("1", "planned", date1),
      createSprint("2", "active", date2),
      createSprint("3", "done", date3),
    ];
    const userStories = [
      createUserStory("us-1", "1", date1),
      createUserStory("us-2", "2", date2),
      createUserStory("us-3", "3", date3),
    ];
    const tasks = [
      createTask("task-1", ["us-1"], "todo"),
      createTask("task-2", ["us-2"], "in-progress"),
      createTask("task-3", ["us-3"], "done"),
    ];

    const items = buildTimelineItemsUserStories(sprints, userStories, tasks);

    expect(items).toHaveLength(3);
    // Ces assertions supposent que la fonction mapTaskStatusToSection assigne correctement les sections
    expect(items.find((i) => i.id === "us-1")?.section).toBe("planning");
    expect(items.find((i) => i.id === "us-2")?.section).toBe("execution");
    expect(items.find((i) => i.id === "us-3")?.section).toBe("review");
  });

  test("devrait éviter les doublons d'US", () => {
    const sprints = [createSprint("1", "active", date1)];
    const userStories = [createUserStory("us-1", "1", date1)];
    const tasks = [
      createTask("task-1", ["us-1"], "in-progress"),
      createTask("task-2", ["us-1"], "in-progress"), // Même US
    ];

    const items = buildTimelineItemsUserStories(sprints, userStories, tasks);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("us-1");
  });

  test("devrait formater correctement les dates", () => {
    const sprints = [createSprint("1", "active", date1)];
    const userStories = [createUserStory("us-1", "1", date1)];
    const tasks = [createTask("task-1", ["us-1"], "in-progress")];

    buildTimelineItemsUserStories(sprints, userStories, tasks);

    // Vérifie que la fonction de formatage a été appelée
    expect(formatDateToFrenchString).toHaveBeenCalled();
  });
});
