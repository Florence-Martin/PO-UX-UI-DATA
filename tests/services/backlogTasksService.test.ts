/**
 * @jest-environment jsdom
 */

import {
  createBacklogTask,
  deleteBacklogTask,
  getAllBacklogTasks,
  updateBacklogTask,
} from "../../lib/services/backlogTasksService";

// Mock Firebase
jest.mock("../../lib/firebase", () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firestore functions
const mockGetDocs = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
}));

describe("backlogTasksService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBacklogTasks", () => {
    it("should return all backlog tasks", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", status: "todo" },
        { id: "2", title: "Task 2", status: "in-progress" },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task,
        })),
      });

      const result = await getAllBacklogTasks();

      expect(result).toEqual(
        mockTasks.map((task) => ({ id: task.id, ...task }))
      );
      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "backlog_tasks"
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });

    it("should handle empty result", async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      const result = await getAllBacklogTasks();

      expect(result).toEqual([]);
    });
  });

  describe("createBacklogTask", () => {
    it("should create a new backlog task", async () => {
      const newTask = {
        title: "New Task",
        description: "Task description",
        status: "todo" as const,
        priority: "medium" as const,
      };

      const mockDocRef = { id: "new-task-id" };
      mockAddDoc.mockResolvedValue(mockDocRef);

      const result = await createBacklogTask(newTask);

      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "backlog_tasks"
      );
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...newTask,
          createdAt: expect.any(Object),
          updatedAt: expect.any(Object),
        })
      );
      expect(result).toBe("new-task-id");
    });
  });

  describe("updateBacklogTask", () => {
    it("should update a backlog task", async () => {
      const taskId = "task-1";
      const updates = { title: "Updated Task", status: "done" as const };

      await updateBacklogTask(taskId, updates);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "backlog_tasks",
        taskId
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

  describe("deleteBacklogTask", () => {
    it("should delete a backlog task", async () => {
      const taskId = "task-1";

      await deleteBacklogTask(taskId);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "backlog_tasks",
        taskId
      );
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
