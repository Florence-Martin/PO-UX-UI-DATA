import { computeSprintStatus } from "../lib/utils/computeSprintStatus";
import { BacklogTask } from "../lib/types/backlogTask";
import { Timestamp } from "firebase/firestore";

describe("computeSprintStatus", () => {
  // Fonction helper pour créer des tâches avec un statut spécifique
  const createTask = (
    id: string,
    status: "todo" | "in-progress" | "done" | "in-testing"
  ): BacklogTask => ({
    id,
    status,
    title: `Task ${id}`,
    description: `Description de la tâche ${id}`,
    priority: "medium",
    storyPoints: 3,
    userStoryIds: [],
    badge: null,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });

  test("devrait retourner 'planned' quand toutes les tâches sont à faire", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "todo"),
      createTask("2", "todo"),
      createTask("3", "todo"),
    ];

    expect(computeSprintStatus(tasks)).toBe("planned");
  });

  test("devrait retourner 'active' quand au moins une tâche est en cours", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "todo"),
      createTask("2", "in-progress"),
      createTask("3", "todo"),
    ];

    expect(computeSprintStatus(tasks)).toBe("active");
  });

  test("devrait retourner 'active' quand au moins une tâche est en test", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "todo"),
      createTask("2", "in-testing"),
      createTask("3", "todo"),
    ];

    expect(computeSprintStatus(tasks)).toBe("active");
  });

  test("devrait retourner 'review' quand toutes les tâches sont terminées", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "done"),
      createTask("2", "done"),
      createTask("3", "done"),
    ];

    expect(computeSprintStatus(tasks)).toBe("review");
  });

  test("devrait retourner 'planned' quand il y a un mix de tâches à faire et terminées", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "todo"),
      createTask("2", "done"),
      createTask("3", "todo"),
    ];

    expect(computeSprintStatus(tasks)).toBe("planned");
  });

  test("devrait retourner 'active' quand il y a un mix de tâches à faire, en cours et terminées", () => {
    const tasks: BacklogTask[] = [
      createTask("1", "todo"),
      createTask("2", "in-progress"),
      createTask("3", "done"),
    ];

    expect(computeSprintStatus(tasks)).toBe("active");
  });

  test("devrait retourner 'planned' pour un tableau de tâches vide", () => {
    const tasks: BacklogTask[] = [];

    expect(computeSprintStatus(tasks)).toBe("planned");
  });
});
