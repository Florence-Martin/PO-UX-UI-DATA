/**
 * @jest-environment jsdom
 */

// Mock Firebase AVANT d'importer le service
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ isServerTimestamp: true })),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
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

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  createSprint,
  deleteSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
} from "../../lib/services/sprintService";

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;

describe("sprintService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock doc et collection pour retourner des références valides
    mockDoc.mockReturnValue({ id: "sprint_test" } as any);
    mockCollection.mockReturnValue({ path: "sprints" } as any);
  });

  describe("getAllSprints", () => {
    it("should return all sprints", async () => {
      const mockSprints = [
        {
          id: "1",
          title: "Sprint 1",
          status: "completed" as const,
          startDate: { toDate: () => new Date("2024-01-01") },
          endDate: { toDate: () => new Date("2024-01-14") },
        },
        {
          id: "2",
          title: "Sprint 2",
          status: "active" as const,
          startDate: { toDate: () => new Date("2024-01-15") },
          endDate: { toDate: () => new Date("2024-01-28") },
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockSprints.map((sprint) => ({
          id: sprint.id,
          data: () => sprint,
        })),
      } as any);

      const result = await getAllSprints();

      expect(result).toEqual([
        {
          id: "1",
          title: "Sprint 1",
          status: "completed",
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-01-14"),
        },
        {
          id: "2",
          title: "Sprint 2",
          status: "active",
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-01-28"),
        },
      ]);
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("getSprintById", () => {
    it("should return a sprint by id", async () => {
      const mockSprint = {
        id: "1",
        title: "Sprint 1",
        status: "planning" as const,
        startDate: { toDate: () => new Date("2024-01-01") },
        endDate: { toDate: () => new Date("2024-01-14") },
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockSprint,
        id: "1",
      } as any);

      const result = await getSprintById("1");

      expect(result).toEqual({
        id: "1",
        title: "Sprint 1",
        status: "planning",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-14"),
      });
      expect(mockDoc).toHaveBeenCalled();
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("should return null for non-existent sprint", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      } as any);

      const result = await getSprintById("999");

      expect(result).toBeNull();
    });
  });

  describe("createSprint", () => {
    it("should create a new sprint", async () => {
      const newSprint = {
        title: "New Sprint",
        goal: "Sprint goal",
        startDate: { toDate: () => new Date() } as any,
        endDate: { toDate: () => new Date() } as any,
        userStoryIds: [],
        velocity: 0,
        hasReview: false,
        hasRetrospective: false,
      };

      const mockDocRef = { id: "new-sprint-id" };
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createSprint(newSprint);

      expect(result).toBe("new-sprint-id");
      expect(mockAddDoc).toHaveBeenCalled();
    });
  });

  describe("updateSprint", () => {
    it("should update a sprint", async () => {
      const sprintId = "sprint-1";
      const updates = { title: "Updated Sprint" };

      await updateSprint(sprintId, updates);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe("deleteSprint", () => {
    it("should delete a sprint", async () => {
      const sprintId = "sprint-1";

      // Mock que le sprint existe
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ title: "Test Sprint" }),
      } as any);

      await deleteSprint(sprintId);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockGetDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
