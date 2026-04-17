/**
 * Tests pour la logique de détection des sprints actifs (US-036)
 * Tests de la logique métier sans renderHook
 */

import { Timestamp } from "firebase/firestore";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date("2025-11-27") })),
    fromDate: jest.fn((date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: (date.getTime() % 1000) * 1000000,
      toDate: () => date,
    })),
  },
}));

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("@/lib/services/sprintService", () => ({
  getAllSprints: jest.fn(),
}));

const mockGetAllSprints = getAllSprints as jest.MockedFunction<
  typeof getAllSprints
>;

function createSprint(
  overrides: Partial<Sprint> & Pick<Sprint, "id" | "title">
): Sprint {
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

/**
 * Convertit n'importe quel format de date en Date JS (copie de la fonction du hook).
 */
function parseDate(date: Date | string | any): Date {
  // Vérifier si c'est un Timestamp Firebase (a une méthode toDate)
  if (date && typeof date.toDate === "function") return date.toDate();
  return new Date(date);
}

/**
 * Vérifie si un sprint est en cours (copie de la fonction du hook).
 */
function isCurrentSprint(sprint: Sprint): boolean {
  const now = new Date("2025-11-27"); // Date mockée
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);

  // Inclure toute la journée de fin
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

/**
 * Logique de filtrage des sprints actifs (extraite du hook).
 */
function filterActiveSprints(sprints: Sprint[]): Sprint[] {
  return sprints.filter((sprint) => {
    // Exclure les sprints terminés
    if (sprint.status === "done") return false;

    // Priorité 1: flag isActive
    if (sprint.isActive === true) return true;

    // Priorité 2: date range
    return isCurrentSprint(sprint);
  });
}

describe("useActiveSprints - Logique métier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Détection des sprints actifs", () => {
    it("doit retourner les sprints avec isActive=true", async () => {
      const mockSprints: Sprint[] = [
        {
          id: "sprint1",
          title: "Sprint 28 - Workflow",
          startDate: Timestamp.fromDate(new Date("2025-11-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-15")) as unknown as Timestamp,
          status: "active",
          isActive: true,
          userStoryIds: ["us1"],
          velocity: 0,
          progress: 0,
          hasReview: false,
          hasRetrospective: false,
        },
        {
          id: "sprint2",
          title: "Sprint 29 - Multi-tâches",
          startDate: Timestamp.fromDate(new Date("2025-11-15")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-30")) as unknown as Timestamp,
          status: "active",
          isActive: true,
          userStoryIds: ["us2"],
          velocity: 0,
          progress: 0,
          hasReview: false,
          hasRetrospective: false,
        },
        {
          id: "sprint3",
          title: "Sprint 30 - Futur",
          startDate: Timestamp.fromDate(new Date("2026-01-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2026-01-15")) as unknown as Timestamp,
          status: "planned",
          isActive: false,
          userStoryIds: [],
          velocity: 0,
          progress: 0,
          hasReview: false,
          hasRetrospective: false,
        },
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(2);
      expect(activeSprints[0].id).toBe("sprint1");
      expect(activeSprints[1].id).toBe("sprint2");
    });

    it("doit exclure les sprints avec status=done", async () => {
      const mockSprints: Sprint[] = [
        createSprint({
          id: "sprint1",
          title: "Sprint actif",
          startDate: Timestamp.fromDate(new Date("2025-11-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-15")) as unknown as Timestamp,
          status: "active",
          isActive: true,
          userStoryIds: ["us1"],
        }),
        createSprint({
          id: "sprint2",
          title: "Sprint termine",
          startDate: Timestamp.fromDate(new Date("2025-10-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-10-15")) as unknown as Timestamp,
          status: "done",
          isActive: true,
          userStoryIds: ["us2"],
        }),
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(1);
      expect(activeSprints[0].id).toBe("sprint1");
      expect(activeSprints[0].status).toBe("active");
    });

    it("doit détecter les sprints actifs par date range (fallback)", async () => {
      // Date actuelle mockée : 2025-11-27
      const mockSprints: Sprint[] = [
        createSprint({
          id: "sprint1",
          title: "Sprint en cours par date",
          startDate: Timestamp.fromDate(new Date("2025-11-20")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-05")) as unknown as Timestamp,
          status: "active",
          isActive: false,
          userStoryIds: ["us1"],
        }),
        createSprint({
          id: "sprint2",
          title: "Sprint futur",
          startDate: Timestamp.fromDate(new Date("2026-01-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2026-01-15")) as unknown as Timestamp,
          status: "planned",
          isActive: false,
          userStoryIds: [],
        }),
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(1);
      expect(activeSprints[0].id).toBe("sprint1");
    });

    it("doit retourner un tableau vide si aucun sprint actif", async () => {
      const mockSprints: Sprint[] = [
        createSprint({
          id: "sprint1",
          title: "Sprint termine",
          startDate: Timestamp.fromDate(new Date("2025-10-01")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-10-15")) as unknown as Timestamp,
          status: "done",
          isActive: false,
          userStoryIds: [],
        }),
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(0);
    });
  });

  describe("Fonction parseDate", () => {
    it("doit convertir un Timestamp Firebase en Date", () => {
      const timestamp = {
        toDate: () => new Date("2025-11-27"),
      } as Timestamp;

      const result = parseDate(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(10); // Novembre = 10
      expect(result.getDate()).toBe(27);
    });

    it("doit convertir une string en Date", () => {
      const dateString = "2025-11-27";

      const result = parseDate(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
    });

    it("doit retourner une Date inchangée", () => {
      const date = new Date("2025-11-27");

      const result = parseDate(date);

      expect(result).toStrictEqual(date);
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe("Fonction isCurrentSprint", () => {
    it("doit retourner true si la date actuelle est dans la plage", () => {
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint en cours",
        startDate: Timestamp.fromDate(new Date("2025-11-20")) as unknown as Timestamp,
        endDate: Timestamp.fromDate(new Date("2025-12-05")) as unknown as Timestamp,
        status: "active",
      });

      const result = isCurrentSprint(sprint);

      expect(result).toBe(true);
    });

    it("doit retourner false si la date actuelle est avant le début", () => {
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint futur",
        startDate: Timestamp.fromDate(new Date("2026-01-01")) as unknown as Timestamp,
        endDate: Timestamp.fromDate(new Date("2026-01-15")) as unknown as Timestamp,
        status: "planned",
      });

      const result = isCurrentSprint(sprint);

      expect(result).toBe(false);
    });

    it("doit retourner false si la date actuelle est après la fin", () => {
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint passe",
        startDate: Timestamp.fromDate(new Date("2025-10-01")) as unknown as Timestamp,
        endDate: Timestamp.fromDate(new Date("2025-10-15")) as unknown as Timestamp,
        status: "done",
      });

      const result = isCurrentSprint(sprint);

      expect(result).toBe(false);
    });

    it("doit inclure toute la journée de fin (23:59:59)", () => {
      // Si la date actuelle est 2025-11-27 et la fin est 2025-11-27,
      // le sprint doit être considéré comme actif
      const sprint = createSprint({
        id: "sprint1",
        title: "Sprint dernier jour",
        startDate: Timestamp.fromDate(new Date("2025-11-20")) as unknown as Timestamp,
        endDate: Timestamp.fromDate(new Date("2025-11-27")) as unknown as Timestamp,
        status: "active",
      });

      const result = isCurrentSprint(sprint);

      expect(result).toBe(true);
    });
  });

  describe("Scénario multi-sprint réel", () => {
    it("doit gérer 2 sprints actifs simultanément (Sprint 28 + Sprint 29)", async () => {
      const mockSprints: Sprint[] = [
        createSprint({
          id: "sprint28",
          title: "Sprint 28 test - Workflow 2025",
          startDate: Timestamp.fromDate(new Date("2025-11-27")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-11")) as unknown as Timestamp,
          status: "active",
          isActive: true,
          userStoryIds: ["2wxnxrHkHdFxsp2TQGZG"],
        }),
        createSprint({
          id: "sprint29",
          title: "Sprint 29 - Multi-taches User Stories",
          startDate: Timestamp.fromDate(new Date("2025-11-27")) as unknown as Timestamp,
          endDate: Timestamp.fromDate(new Date("2025-12-11")) as unknown as Timestamp,
          status: "active",
          isActive: true,
          userStoryIds: ["l3A27ElA15Q5v7DYHmyN"],
        }),
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(2);
      expect(activeSprints.some((s) => s.id === "sprint28")).toBe(true);
      expect(activeSprints.some((s) => s.id === "sprint29")).toBe(true);
    });
  });
});
