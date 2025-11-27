/**
 * Tests pour la logique de détection des sprints actifs (US-036)
 * Tests de la logique métier sans renderHook
 */

import { Timestamp } from "firebase/firestore";
import { getAllSprints } from "../../lib/services/sprintService";
import { Sprint } from "../../lib/types/sprint";

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

jest.mock("../../lib/firebase", () => ({
  db: {},
}));

jest.mock("../../lib/services/sprintService", () => ({
  getAllSprints: jest.fn(),
}));

const mockGetAllSprints = getAllSprints as jest.MockedFunction<
  typeof getAllSprints
>;

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
          startDate: new Date("2025-11-01"),
          endDate: new Date("2025-12-15"),
          status: "in-progress",
          isActive: true,
          userStoryIds: ["us1"],
        } as Sprint,
        {
          id: "sprint2",
          title: "Sprint 29 - Multi-tâches",
          startDate: new Date("2025-11-15"),
          endDate: new Date("2025-12-30"),
          status: "in-progress",
          isActive: true,
          userStoryIds: ["us2"],
        } as Sprint,
        {
          id: "sprint3",
          title: "Sprint 30 - Futur",
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-01-15"),
          status: "planned",
          isActive: false,
          userStoryIds: [],
        } as Sprint,
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
        {
          id: "sprint1",
          title: "Sprint actif",
          startDate: new Date("2025-11-01"),
          endDate: new Date("2025-12-15"),
          status: "in-progress",
          isActive: true,
          userStoryIds: ["us1"],
        } as Sprint,
        {
          id: "sprint2",
          title: "Sprint terminé",
          startDate: new Date("2025-10-01"),
          endDate: new Date("2025-10-15"),
          status: "done",
          isActive: true,
          userStoryIds: ["us2"],
        } as Sprint,
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(1);
      expect(activeSprints[0].id).toBe("sprint1");
      expect(activeSprints[0].status).toBe("in-progress");
    });

    it("doit détecter les sprints actifs par date range (fallback)", async () => {
      // Date actuelle mockée : 2025-11-27
      const mockSprints: Sprint[] = [
        {
          id: "sprint1",
          title: "Sprint en cours par date",
          startDate: new Date("2025-11-20"),
          endDate: new Date("2025-12-05"),
          status: "in-progress",
          isActive: false, // Pas de flag, mais dans la date range
          userStoryIds: ["us1"],
        } as Sprint,
        {
          id: "sprint2",
          title: "Sprint futur",
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-01-15"),
          status: "planned",
          isActive: false,
          userStoryIds: [],
        } as Sprint,
      ];

      mockGetAllSprints.mockResolvedValue(mockSprints);

      const sprints = await getAllSprints();
      const activeSprints = filterActiveSprints(sprints);

      expect(activeSprints).toHaveLength(1);
      expect(activeSprints[0].id).toBe("sprint1");
    });

    it("doit retourner un tableau vide si aucun sprint actif", async () => {
      const mockSprints: Sprint[] = [
        {
          id: "sprint1",
          title: "Sprint terminé",
          startDate: new Date("2025-10-01"),
          endDate: new Date("2025-10-15"),
          status: "done",
          isActive: false,
          userStoryIds: [],
        } as Sprint,
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
      const sprint: Sprint = {
        id: "sprint1",
        title: "Sprint en cours",
        startDate: new Date("2025-11-20"),
        endDate: new Date("2025-12-05"),
        status: "in-progress",
      } as Sprint;

      const result = isCurrentSprint(sprint);

      expect(result).toBe(true);
    });

    it("doit retourner false si la date actuelle est avant le début", () => {
      const sprint: Sprint = {
        id: "sprint1",
        title: "Sprint futur",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-01-15"),
        status: "planned",
      } as Sprint;

      const result = isCurrentSprint(sprint);

      expect(result).toBe(false);
    });

    it("doit retourner false si la date actuelle est après la fin", () => {
      const sprint: Sprint = {
        id: "sprint1",
        title: "Sprint passé",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-15"),
        status: "done",
      } as Sprint;

      const result = isCurrentSprint(sprint);

      expect(result).toBe(false);
    });

    it("doit inclure toute la journée de fin (23:59:59)", () => {
      // Si la date actuelle est 2025-11-27 et la fin est 2025-11-27,
      // le sprint doit être considéré comme actif
      const sprint: Sprint = {
        id: "sprint1",
        title: "Sprint dernier jour",
        startDate: new Date("2025-11-20"),
        endDate: new Date("2025-11-27"), // Aujourd'hui
        status: "in-progress",
      } as Sprint;

      const result = isCurrentSprint(sprint);

      expect(result).toBe(true);
    });
  });

  describe("Scénario multi-sprint réel", () => {
    it("doit gérer 2 sprints actifs simultanément (Sprint 28 + Sprint 29)", async () => {
      const mockSprints: Sprint[] = [
        {
          id: "sprint28",
          title: "Sprint 28 test - Workflow 2025",
          startDate: new Date("2025-11-27"),
          endDate: new Date("2025-12-11"),
          status: "in-progress",
          isActive: true,
          userStoryIds: ["2wxnxrHkHdFxsp2TQGZG"], // US-036
        } as Sprint,
        {
          id: "sprint29",
          title: "Sprint 29 - Multi-tâches User Stories",
          startDate: new Date("2025-11-27"),
          endDate: new Date("2025-12-11"),
          status: "in-progress",
          isActive: true,
          userStoryIds: ["l3A27ElA15Q5v7DYHmyN"], // US-037
        } as Sprint,
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
