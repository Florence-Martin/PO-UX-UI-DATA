/**
 * @jest-environment jsdom
 */

import {
  createBacklogTask,
  deleteBacklogTask,
  getAllBacklogTasks,
  updateBacklogTask,
} from "../../lib/services/backlogTasksService";

import {
  mockAddDoc,
  mockDeleteDoc,
  mockDoc,
  mockGetDocs,
  mockUpdateDoc,
} from "../setup";

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
        mockTasks.map((task) => ({ ...task, id: task.id }))
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });

    it("should handle empty result", async () => {
      mockGetDocs.mockResolvedValue({
        docs: [],
      });

      const result = await getAllBacklogTasks();

      expect(result).toEqual([]);
      expect(mockGetDocs).toHaveBeenCalled();
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

      expect(mockAddDoc).toHaveBeenCalled();
      expect(result.id).toBe("new-task-id");
      expect(result.title).toBe(newTask.title);
    });
  });

  describe("updateBacklogTask", () => {
    it("should update a backlog task", async () => {
      const taskId = "task-1";
      const updates = { title: "Updated Task" };

      await updateBacklogTask(taskId, updates);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe("deleteBacklogTask", () => {
    it("should delete a backlog task", async () => {
      const taskId = "task-1";

      await deleteBacklogTask(taskId);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
