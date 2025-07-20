/**
 * @jest-environment jsdom
 */

import {
  createUserStory,
  deleteUserStory,
  getAllUserStories,
  updateUserStory,
} from "../../lib/services/userStoryService";

// Mock Firebase
jest.mock("../../lib/firebase", () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firestore functions
const mockGetDocs = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
}));

describe("userStoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUserStories", () => {
    it("should return all user stories", async () => {
      const mockStories = [
        { id: "1", code: "US-001", title: "Story 1" },
        { id: "2", code: "US-002", title: "Story 2" },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockStories.map((story) => ({
          id: story.id,
          data: () => story,
        })),
      });

      const result = await getAllUserStories();

      expect(result).toEqual(mockStories);
      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "user_stories"
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("createUserStory", () => {
    it("should create a new user story with unique code", async () => {
      const newStory = {
        title: "New Story",
        description: "Story description",
        priority: "medium" as const,
      };

      // Mock existing codes
      mockGetDocs.mockResolvedValue({
        docs: [
          { data: () => ({ code: "US-001" }) },
          { data: () => ({ code: "US-002" }) },
        ],
      });

      const mockDocRef = { id: "new-story-id" };
      mockDoc.mockReturnValue(mockDocRef);

      const result = await createUserStory(newStory);

      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "user_stories"
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          id: "new-story-id",
          code: "US-003", // Should be next available code
          ...newStory,
        })
      );
      expect(result.code).toBe("US-003");
    });
  });

  describe("updateUserStory", () => {
    it("should update a user story", async () => {
      const storyId = "story-1";
      const updates = { title: "Updated Story" };

      await updateUserStory(storyId, updates);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_stories",
        storyId
      );
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...updates,
          updatedAt: expect.any(Object),
        })
      );
    });
  });

  describe("deleteUserStory", () => {
    it("should delete a user story", async () => {
      const storyId = "story-1";

      await deleteUserStory(storyId);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_stories",
        storyId
      );
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
