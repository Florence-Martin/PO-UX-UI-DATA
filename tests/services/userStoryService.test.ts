import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  createUserStory,
  deleteUserStory,
  getAllUserStories,
  getUsedUserStoryIds,
  getUserStoriesByMoscow,
  updateUserStory,
  updateUserStorySprint,
} from "../../lib/services/userStoryService";

// Mock Firebase
jest.mock("firebase/firestore");
jest.mock("../../lib/firebase", () => ({
  db: {},
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

// Mock Timestamp
const mockTimestamp = {
  fromDate: jest.fn((date: Date) => ({
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000,
  })),
  now: jest.fn(() => ({
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: (Date.now() % 1000) * 1000000,
  })),
};

(Timestamp as any).fromDate = mockTimestamp.fromDate;
(Timestamp as any).now = mockTimestamp.now;

describe("UserStoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log for debug messages
  });

  const mockUserStories = [
    {
      id: "us1",
      code: "US-001",
      title: "User Login",
      description: "As a user, I want to login",
      status: "todo",
      priority: "high",
      storyPoints: 5,
      acceptanceCriteria: "User can enter credentials and get authenticated",
      sprintId: "sprint1",
      assignedTo: "dev1",
    },
    {
      id: "us2",
      code: "US-002",
      title: "User Logout",
      description: "As a user, I want to logout",
      status: "in-progress",
      priority: "medium",
      storyPoints: 3,
      acceptanceCriteria: "User can logout and session is cleared",
      assignedTo: "dev2",
    },
  ];

  describe("getAllUserStories", () => {
    it("should return all user stories", async () => {
      const mockQuerySnapshot = {
        docs: mockUserStories.map((story) => ({
          id: story.id,
          data: () => ({ ...story }),
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllUserStories();

      expect(mockCollection).toHaveBeenCalledWith({}, "user_stories");
      expect(mockGetDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("us1");
      expect(result[0].title).toBe("User Login");
    });

    it("should return empty array when no user stories exist", async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllUserStories();

      expect(result).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      mockGetDocs.mockRejectedValue(new Error("Firebase error"));

      await expect(getAllUserStories()).rejects.toThrow("Firebase error");
    });
  });

  describe("createUserStory", () => {
    it("should create a new user story with auto-generated code", async () => {
      const newStoryData = {
        title: "New Feature",
        description: "As a user, I want a new feature",
        priority: "medium" as const,
        storyPoints: 8,
        acceptanceCriteria: "Feature works correctly and meets requirements",
        status: "todo" as const,
        assignedTo: "dev1",
      };

      // Mock existing codes to test code generation
      const mockCodesSnapshot = {
        docs: [
          { data: () => ({ code: "US-001" }) },
          { data: () => ({ code: "US-002" }) },
        ],
      };

      const mockDocRef = {
        id: "us3",
      };

      mockGetDocs.mockResolvedValue(mockCodesSnapshot as any);
      mockDoc.mockReturnValue(mockDocRef as any);

      const result = await createUserStory(newStoryData);

      expect(mockCollection).toHaveBeenCalledWith({}, "user_stories");
      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          id: "us3",
          code: "US-003", // Should be next available code
          ...newStoryData,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        })
      );
      expect(result.code).toBe("US-003");
    });

    it("should handle gaps in code sequence", async () => {
      const newStoryData = {
        title: "Gap Test",
        description: "Testing code generation with gaps",
        priority: "low" as const,
        storyPoints: 2,
        acceptanceCriteria: "Works correctly",
        status: "todo" as const,
        assignedTo: "dev1",
      };

      // Mock existing codes with gaps
      const mockCodesSnapshot = {
        docs: [
          { data: () => ({ code: "US-001" }) },
          { data: () => ({ code: "US-003" }) }, // Gap at US-002
          { data: () => ({ code: "US-005" }) },
        ],
      };

      const mockDocRef = { id: "us_new" };

      mockGetDocs.mockResolvedValue(mockCodesSnapshot as any);
      mockDoc.mockReturnValue(mockDocRef as any);

      const result = await createUserStory(newStoryData);

      expect(result.code).toBe("US-002"); // Should fill the gap
    });
  });

  describe("updateUserStory", () => {
    it("should update an existing user story", async () => {
      const updateData = {
        title: "Updated Title",
        status: "done" as const,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateUserStory("us1", updateData);

      expect(mockDoc).toHaveBeenCalledWith({}, "user_stories", "us1");
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          ...updateData,
          updatedAt: expect.anything(),
        })
      );
    });
  });

  describe("deleteUserStory", () => {
    it("should delete a user story that is not linked to a sprint", async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: "us1",
            data: () => ({ id: "us1", sprintId: null }), // No sprint
          },
        ],
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      await deleteUserStory("us1");

      expect(mockDoc).toHaveBeenCalledWith({}, "user_stories", "us1");
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it("should throw error when trying to delete user story linked to sprint", async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: "us1",
            data: () => ({ id: "us1", sprintId: "sprint1" }), // Has sprint
          },
        ],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      await expect(deleteUserStory("us1")).rejects.toThrow(
        "Impossible de supprimer cette User Story : elle est liée à un sprint."
      );
    });
  });

  describe("getUsedUserStoryIds", () => {
    it("should return array of used user story IDs from backlog tasks", async () => {
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          const mockDocs = [
            { data: () => ({ userStoryIds: ["US-001", "US-002"] }) },
            { data: () => ({ userStoryIds: ["US-002", "US-003"] }) },
            { data: () => ({}) }, // No userStoryIds
          ];
          mockDocs.forEach(callback);
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getUsedUserStoryIds();

      expect(mockCollection).toHaveBeenCalledWith({}, "backlog_tasks");
      expect(result).toEqual(["US-001", "US-002", "US-003"]);
    });

    it("should handle empty backlog tasks", async () => {
      const mockQuerySnapshot = {
        forEach: jest.fn(),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getUsedUserStoryIds();

      expect(result).toEqual([]);
    });
  });

  describe("getUserStoriesByMoscow", () => {
    it("should return user stories grouped by Moscow priority", async () => {
      const storiesWithMoscow = [
        { ...mockUserStories[0], moscow: "mustHave" },
        { ...mockUserStories[1], moscow: "shouldHave" },
      ];

      const mockQuerySnapshot = {
        docs: storiesWithMoscow.map((story) => ({
          id: story.id,
          data: () => ({ ...story }),
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getUserStoriesByMoscow();

      expect(result).toHaveProperty("mustHave");
      expect(result).toHaveProperty("shouldHave");
      expect(result).toHaveProperty("couldHave");
      expect(result).toHaveProperty("wontHave");
      expect(result.mustHave).toHaveLength(1);
      expect(result.shouldHave).toHaveLength(1);
      expect(result.couldHave).toHaveLength(0);
      expect(result.wontHave).toHaveLength(0);
    });
  });

  describe("updateUserStorySprint", () => {
    it("should update sprint assignment and add sprint badge", async () => {
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateUserStorySprint("us1", "sprint2");

      expect(mockDoc).toHaveBeenCalledWith({}, "user_stories", "us1");
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          sprintId: "sprint2",
          badge: "sprint",
          updatedAt: expect.anything(),
        })
      );
    });

    it("should remove sprint assignment and badge when sprintId is null", async () => {
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateUserStorySprint("us1", null);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          sprintId: null,
          badge: null,
          updatedAt: expect.anything(),
        })
      );
    });
  });

  describe("Error handling", () => {
    it("should handle Firebase errors during creation", async () => {
      const newStory = {
        title: "Test Story",
        description: "Test description",
        priority: "low" as const,
        storyPoints: 2,
        acceptanceCriteria: "Test criteria",
        status: "todo" as const,
        assignedTo: "dev1",
      };

      mockGetDocs.mockResolvedValue({ docs: [] } as any);
      mockDoc.mockReturnValue({ id: "test-id" } as any);
      mockSetDoc.mockRejectedValue(new Error("Creation failed"));

      await expect(createUserStory(newStory)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("should handle Firebase errors during updates", async () => {
      mockDoc.mockReturnValue({} as any);
      mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

      await expect(
        updateUserStory("us1", { title: "New Title" })
      ).rejects.toThrow("Update failed");
    });
  });

  describe("Data validation", () => {
    it("should handle empty data gracefully", async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: "empty1",
            data: () => ({}),
          },
        ],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllUserStories();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("empty1");
    });

    it("should preserve data types during updates", async () => {
      const updateData = {
        storyPoints: 5,
        priority: "high" as const,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockUpdateDoc.mockResolvedValue(undefined); // Reset mock to success

      await updateUserStory("us1", updateData);

      const callArgs = mockUpdateDoc.mock.calls[0][1] as any;
      expect(typeof callArgs.storyPoints).toBe("number");
      expect(callArgs.priority).toBe("high");
    });
  });
});
