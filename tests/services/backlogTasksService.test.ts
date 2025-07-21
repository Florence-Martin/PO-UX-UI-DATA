import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createBacklogTask,
  deleteBacklogTask,
  getAllBacklogTasks,
  removeUserStoryIdFromTasks,
  updateBacklogTask,
} from "../../lib/services/backlogTasksService";
import { BacklogTask } from "../../lib/types/backlogTask";

// Mock Firebase
jest.mock("firebase/firestore");
jest.mock("../../lib/firebase", () => ({
  db: {},
}));

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockArrayRemove = arrayRemove as jest.MockedFunction<typeof arrayRemove>;

// Mock Timestamp
const mockTimestamp = {
  now: jest.fn(() => ({
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: (Date.now() % 1000) * 1000000,
  })),
};

(Timestamp as any).now = mockTimestamp.now;

describe("BacklogTasksService", () => {
  // Declare mock references at the describe level so they're accessible in all tests
  let mockCollectionRef: any;
  let mockDocRef: any;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log for debug messages

    // Set up proper mock implementations
    mockCollectionRef = {};
    mockDocRef = {};

    mockCollection.mockReturnValue(mockCollectionRef);
    mockDoc.mockReturnValue(mockDocRef);
    mockAddDoc.mockResolvedValue({ id: "mock-id" } as any);
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  const mockBacklogTasks: BacklogTask[] = [
    {
      id: "task1",
      title: "Implement login feature",
      description: "Create user authentication system",
      priority: "high",
      storyPoints: 8,
      status: "todo",
      userStoryIds: ["us1", "us2"],
      badge: "sprint",
      createdAt: {
        seconds: 1640995200,
        nanoseconds: 0,
      } as any,
      updatedAt: {
        seconds: 1640995200,
        nanoseconds: 0,
      } as any,
    },
    {
      id: "task2",
      title: "Setup database",
      description: "Configure PostgreSQL database",
      priority: "medium",
      storyPoints: 5,
      status: "in-progress",
      userStoryIds: ["us3"],
      createdAt: {
        seconds: 1640995300,
        nanoseconds: 0,
      } as any,
      updatedAt: {
        seconds: 1640995300,
        nanoseconds: 0,
      } as any,
    },
  ];

  describe("getAllBacklogTasks", () => {
    it("should return all backlog tasks", async () => {
      const mockQuerySnapshot = {
        docs: mockBacklogTasks.map((task) => ({
          id: task.id,
          data: () => {
            const { id, ...taskData } = task;
            return taskData;
          },
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllBacklogTasks();

      expect(mockCollection).toHaveBeenCalledWith({}, "backlog_tasks");
      expect(mockGetDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("task1");
      expect(result[0].title).toBe("Implement login feature");
      expect(result[1].id).toBe("task2");
      expect(result[1].title).toBe("Setup database");
    });

    it("should return empty array when no tasks exist", async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllBacklogTasks();

      expect(result).toEqual([]);
    });

    it("should handle Firebase errors gracefully", async () => {
      mockGetDocs.mockRejectedValue(new Error("Firebase error"));

      await expect(getAllBacklogTasks()).rejects.toThrow("Firebase error");
    });
  });

  describe("createBacklogTask", () => {
    it("should create a new backlog task with timestamps", async () => {
      const newTaskData = {
        title: "Write unit tests",
        description: "Add comprehensive test coverage",
        priority: "medium" as const,
        storyPoints: 3,
        status: "todo" as const,
        userStoryIds: ["us4"],
        badge: null,
      };

      const mockDocRef = {
        id: "task3",
      };

      const mockNow = {
        seconds: 1640995400,
        nanoseconds: 0,
      };

      mockCollection.mockReturnValue(mockCollectionRef);
      mockTimestamp.now.mockReturnValue(mockNow);
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createBacklogTask(newTaskData);

      expect(mockCollection).toHaveBeenCalledWith({}, "backlog_tasks");
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        ...newTaskData,
        createdAt: mockNow,
        updatedAt: mockNow,
      });
      expect(result).toEqual({
        id: "task3",
        ...newTaskData,
        createdAt: mockNow,
        updatedAt: mockNow,
      });
    });

    it("should handle Firebase errors during creation", async () => {
      const newTaskData = {
        title: "Test task",
        description: "Test description",
        priority: "low" as const,
        storyPoints: 1,
        status: "todo" as const,
      };

      mockAddDoc.mockRejectedValue(new Error("Creation failed"));

      await expect(createBacklogTask(newTaskData)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("should create task without optional fields", async () => {
      const minimalTaskData = {
        title: "Minimal task",
        description: "Basic task without optional fields",
        priority: "low" as const,
        storyPoints: 1,
        status: "todo" as const,
      };

      const mockDocRef = { id: "minimal-task" };
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createBacklogTask(minimalTaskData);

      expect(result.id).toBe("minimal-task");
      expect(result.title).toBe("Minimal task");
      expect(result.userStoryIds).toBeUndefined();
      expect(result.badge).toBeUndefined();
    });
  });

  describe("updateBacklogTask", () => {
    it("should update a backlog task", async () => {
      const taskId = "task1";
      const updateData = {
        title: "Updated login feature",
        status: "in-progress" as const,
        storyPoints: 10,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateBacklogTask(taskId, updateData);

      expect(mockDoc).toHaveBeenCalledWith({}, "backlog_tasks", taskId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        ...updateData,
        updatedAt: expect.any(Date),
      });
    });

    it("should update task status and badge", async () => {
      const taskId = "task2";
      const updateData = {
        status: "done" as const,
        badge: "sprint" as const,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateBacklogTask(taskId, updateData);

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        status: "done",
        badge: "sprint",
        updatedAt: expect.any(Date),
      });
    });

    it("should handle Firebase errors during update", async () => {
      const updateData = { title: "Failed update" };

      mockDoc.mockReturnValue({} as any);
      mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

      await expect(updateBacklogTask("task1", updateData)).rejects.toThrow(
        "Update failed"
      );
    });

    it("should handle partial updates", async () => {
      const taskId = "task1";
      const partialUpdate = {
        priority: "low" as const,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateBacklogTask(taskId, partialUpdate);

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        priority: "low",
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("deleteBacklogTask", () => {
    it("should delete a backlog task", async () => {
      const taskId = "task1";
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await deleteBacklogTask(taskId);

      expect(mockDoc).toHaveBeenCalledWith({}, "backlog_tasks", taskId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it("should handle Firebase errors during deletion", async () => {
      mockDoc.mockReturnValue({} as any);
      mockDeleteDoc.mockRejectedValue(new Error("Deletion failed"));

      await expect(deleteBacklogTask("task1")).rejects.toThrow(
        "Deletion failed"
      );
    });
  });

  describe("removeUserStoryIdFromTasks", () => {
    it("should remove user story ID from all related tasks", async () => {
      const userStoryId = "us1";
      const tasksWithUserStory = [
        {
          id: "task1",
          data: () => ({ userStoryIds: ["us1", "us2"] }),
        },
        {
          id: "task2",
          data: () => ({ userStoryIds: ["us1"] }),
        },
      ];

      const mockQuerySnapshot = {
        docs: tasksWithUserStory,
      };

      const mockQueryRef = {};
      const mockWhereRef = {};

      mockCollection.mockReturnValue({} as any);
      mockWhere.mockReturnValue(mockWhereRef as any);
      mockQuery.mockReturnValue(mockQueryRef as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockDoc.mockReturnValue({} as any);
      mockArrayRemove.mockReturnValue("array-remove-mock" as any);

      await removeUserStoryIdFromTasks(userStoryId);

      expect(mockCollection).toHaveBeenCalledWith({}, "backlog_tasks");
      expect(mockWhere).toHaveBeenCalledWith(
        "userStoryIds",
        "array-contains",
        userStoryId
      );
      expect(mockQuery).toHaveBeenCalledWith({}, mockWhereRef);
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);

      expect(mockArrayRemove).toHaveBeenCalledWith(userStoryId);
      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
        userStoryIds: "array-remove-mock",
        updatedAt: expect.anything(),
      });
    });

    it("should handle empty query results", async () => {
      const userStoryId = "nonexistent";
      const mockQuerySnapshot = {
        docs: [],
      };

      mockCollection.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      await removeUserStoryIdFromTasks(userStoryId);

      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("should handle Firebase errors during batch update", async () => {
      const userStoryId = "us1";
      const tasksWithUserStory = [
        {
          id: "task1",
          data: () => ({ userStoryIds: ["us1"] }),
        },
      ];

      const mockQuerySnapshot = {
        docs: tasksWithUserStory,
      };

      mockCollection.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockDoc.mockReturnValue({} as any);
      mockArrayRemove.mockReturnValue("array-remove-mock" as any);
      mockUpdateDoc.mockRejectedValue(new Error("Batch update failed"));

      await expect(removeUserStoryIdFromTasks(userStoryId)).rejects.toThrow(
        "Batch update failed"
      );
    });
  });

  describe("Data validation and edge cases", () => {
    it("should handle tasks with empty userStoryIds array", async () => {
      const taskData = {
        title: "Task without user stories",
        description: "Independent task",
        priority: "medium" as const,
        storyPoints: 2,
        status: "todo" as const,
        userStoryIds: [],
      };

      const mockDocRef = { id: "independent-task" };
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createBacklogTask(taskData);

      expect(result.userStoryIds).toEqual([]);
    });

    it("should preserve data types during updates", async () => {
      const updateData = {
        storyPoints: 15,
        priority: "high" as const,
        status: "done" as const,
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await updateBacklogTask("task1", updateData);

      const callArgs = mockUpdateDoc.mock.calls[0][1] as any;
      expect(typeof callArgs.storyPoints).toBe("number");
      expect(callArgs.priority).toBe("high");
      expect(callArgs.status).toBe("done");
      expect(callArgs.updatedAt).toBeInstanceOf(Date);
    });

    it("should handle special characters in task data", async () => {
      const specialTaskData = {
        title: "Tâche spéciale avec accents & symboles",
        description: "Description avec émojis 🚀 et caractères spéciaux @#$%",
        priority: "medium" as const,
        storyPoints: 3,
        status: "todo" as const,
      };

      const mockDocRef = { id: "special-task" };
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createBacklogTask(specialTaskData);

      expect(result.title).toBe("Tâche spéciale avec accents & symboles");
      expect(result.description).toBe(
        "Description avec émojis 🚀 et caractères spéciaux @#$%"
      );
    });
  });

  describe("Integration scenarios", () => {
    it("should handle task lifecycle: create, update, delete", async () => {
      // Create task
      const taskData = {
        title: "Lifecycle test task",
        description: "Test complete lifecycle",
        priority: "medium" as const,
        storyPoints: 5,
        status: "todo" as const,
        userStoryIds: ["us5"],
      };

      const mockDocRef = { id: "lifecycle-task" };
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const createdTask = await createBacklogTask(taskData);
      expect(createdTask.id).toBe("lifecycle-task");

      // Update task
      const updateData = {
        status: "in-progress" as const,
        storyPoints: 8,
      };

      mockDoc.mockReturnValue({} as any);
      await updateBacklogTask("lifecycle-task", updateData);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
        status: "in-progress",
        storyPoints: 8,
        updatedAt: expect.any(Date),
      });

      // Delete task
      await deleteBacklogTask("lifecycle-task");

      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.anything());
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple user story removal", async () => {
      const userStoryIds = ["us1", "us2", "us3"];

      // Mock query results for each user story
      const mockQuerySnapshot = {
        docs: [
          { id: "task1", data: () => ({ userStoryIds: ["us1", "us2"] }) },
          { id: "task2", data: () => ({ userStoryIds: ["us1"] }) },
        ],
      };

      mockCollection.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockDoc.mockReturnValue({} as any);
      mockArrayRemove.mockReturnValue("array-remove-mock" as any);

      // Remove each user story
      await Promise.all(
        userStoryIds.map((id) => removeUserStoryIdFromTasks(id))
      );

      expect(mockGetDocs).toHaveBeenCalledTimes(3);
      expect(mockUpdateDoc).toHaveBeenCalledTimes(6); // 2 tasks × 3 user stories
    });

    it("should handle concurrent task operations", async () => {
      const tasks = [
        {
          title: "Concurrent task 1",
          description: "First concurrent task",
          priority: "high" as const,
          storyPoints: 3,
          status: "todo" as const,
        },
        {
          title: "Concurrent task 2",
          description: "Second concurrent task",
          priority: "medium" as const,
          storyPoints: 5,
          status: "todo" as const,
        },
      ];

      const mockDocRefs = [{ id: "concurrent-1" }, { id: "concurrent-2" }];

      mockAddDoc
        .mockResolvedValueOnce(mockDocRefs[0] as any)
        .mockResolvedValueOnce(mockDocRefs[1] as any);

      const results = await Promise.all(
        tasks.map((task) => createBacklogTask(task))
      );

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe("concurrent-1");
      expect(results[1].id).toBe("concurrent-2");
      expect(mockAddDoc).toHaveBeenCalledTimes(2);
    });
  });
});
