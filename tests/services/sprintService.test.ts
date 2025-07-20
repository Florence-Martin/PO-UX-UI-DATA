/**
 * @jest-environment jsdom
 */

import {
  createSprint,
  deleteSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
} from "../../lib/services/sprintService";

// Mock Firebase
jest.mock("../../lib/firebase", () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firestore functions
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
}));

describe("sprintService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllSprints", () => {
    it("should return all sprints", async () => {
      const mockSprints = [
        {
          id: "1",
          title: "Sprint 1",
          status: "planning" as const,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          id: "2",
          title: "Sprint 2",
          status: "active" as const,
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockSprints.map((sprint) => ({
          id: sprint.id,
          data: () => sprint,
        })),
      });

      const result = await getAllSprints();

      expect(result).toEqual(
        mockSprints.map((sprint) => ({ ...sprint, id: sprint.id }))
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("getSprintById", () => {
    it("should return a sprint by id", async () => {
      const mockSprint = {
        id: "1",
        title: "Sprint 1",
        status: "planning" as const,
        startDate: new Date(),
        endDate: new Date(),
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockSprint,
        id: "1",
      });

      const result = await getSprintById("1");

      expect(result).toEqual({ ...mockSprint, id: "1" });
      expect(mockDoc).toHaveBeenCalled();
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("should return null for non-existent sprint", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

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
      mockAddDoc.mockResolvedValue(mockDocRef);

      const result = await createSprint(newSprint);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(result).toBe("new-sprint-id");
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

      await deleteSprint(sprintId);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
