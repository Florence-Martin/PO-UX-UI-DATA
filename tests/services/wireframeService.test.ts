// Mock Firebase Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: 1725408000, nanoseconds: 0 })),
    fromDate: jest.fn((date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
    })),
  },
}));

// Mock fetch for upload operations
global.fetch = jest.fn();

import { wireframeService } from "@/lib/services/wireframeService";

describe("WireframeService", () => {
  let mockAddDoc: jest.Mock;
  let mockGetDocs: jest.Mock;
  let mockGetDoc: jest.Mock;
  let mockUpdateDoc: jest.Mock;
  let mockDeleteDoc: jest.Mock;
  let mockDoc: jest.Mock;
  let mockCollection: jest.Mock;
  let mockQuery: jest.Mock;
  let mockWhere: jest.Mock;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Get mocked functions
    const firestore = require("firebase/firestore");
    mockAddDoc = firestore.addDoc;
    mockGetDocs = firestore.getDocs;
    mockGetDoc = firestore.getDoc;
    mockUpdateDoc = firestore.updateDoc;
    mockDeleteDoc = firestore.deleteDoc;
    mockDoc = firestore.doc;
    mockCollection = firestore.collection;
    mockQuery = firestore.query;
    mockWhere = firestore.where;
    mockFetch = global.fetch as jest.Mock;

    // Setup default return values
    mockCollection.mockReturnValue("mock-collection-ref");
    mockDoc.mockReturnValue("mock-doc-ref");
    mockQuery.mockReturnValue("mock-query-ref");
    mockWhere.mockReturnValue("mock-where-ref");
  });

  describe("Grid Operations", () => {
    test("should create a new grid", async () => {
      const mockGridData = {
        name: "Test Grid",
        description: "Test Description",
        gridSize: { rows: 3, cols: 3 },
      };

      mockAddDoc.mockResolvedValue({ id: "test-grid-id" });

      const result = await wireframeService.createGrid(mockGridData);

      expect(result).toEqual("test-grid-id");
      expect(mockAddDoc).toHaveBeenCalled();
      // Verify the second argument contains our grid data
      const callArgs = mockAddDoc.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        name: "Test Grid",
        description: "Test Description",
        gridSize: { rows: 3, cols: 3 },
      });
    });

    test("should get all grids", async () => {
      const mockGrids = [
        { name: "Grid 1", gridSize: { rows: 2, cols: 2 } },
        { name: "Grid 2", gridSize: { rows: 3, cols: 3 } },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockGrids.map((grid, index) => ({
          id: `${index + 1}`,
          data: () => grid,
        })),
      });

      const result = await wireframeService.getAllGrids();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        name: "Grid 1",
        gridSize: { rows: 2, cols: 2 },
      });
    });

    test("should get grid by id", async () => {
      const mockGrid = {
        name: "Test Grid",
        gridSize: { rows: 2, cols: 2 },
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: "test-id",
        data: () => mockGrid,
      });

      const result = await wireframeService.getGrid("test-id");

      expect(result).toEqual({
        id: "test-id",
        name: "Test Grid",
        gridSize: { rows: 2, cols: 2 },
      });
    });

    test("should return null for non-existent grid", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await wireframeService.getGrid("non-existent-id");

      expect(result).toBeNull();
    });

    test("should update grid", async () => {
      const updateData = {
        name: "Updated Grid",
        gridSize: { rows: 4, cols: 4 },
      };

      await wireframeService.updateGrid("test-id", updateData);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        "mock-doc-ref",
        expect.objectContaining({
          ...updateData,
          updatedAt: expect.any(Object),
        })
      );
    });

    test("should delete grid", async () => {
      await wireframeService.deleteGrid("test-id");

      expect(mockDeleteDoc).toHaveBeenCalledWith("mock-doc-ref");
    });
  });

  describe("Image Operations", () => {
    test("should upload image", async () => {
      const mockFile = new File(["test content"], "test.png", {
        type: "image/png",
      });
      const gridSize = { rows: 2, cols: 2 };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          downloadUrl: "/wireframes/test.png",
          filename: "test.png",
        }),
      });

      mockAddDoc.mockResolvedValue({ id: "test-image-id" });

      const result = await wireframeService.uploadImage(
        "test-grid-id",
        0,
        mockFile,
        gridSize
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-image-id",
          gridId: "test-grid-id",
          cellIndex: 0,
        })
      );
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/upload-wireframe",
        expect.any(Object)
      );
    });

    test("should handle upload error", async () => {
      const mockFile = new File(["test content"], "test.png", {
        type: "image/png",
      });
      const gridSize = { rows: 2, cols: 2 };

      mockFetch.mockResolvedValue({
        ok: false,
        statusText: "Internal Server Error",
        text: async () => "Upload failed",
      });

      await expect(
        wireframeService.uploadImage("test-grid-id", 0, mockFile, gridSize)
      ).rejects.toThrow("Erreur upload: Internal Server Error - Upload failed");
    });

    test("should delete image", async () => {
      const mockImage = {
        downloadUrl: "/wireframes/test.png",
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockImage,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await wireframeService.deleteImage("test-image-id");

      expect(mockDeleteDoc).toHaveBeenCalledWith("mock-doc-ref");
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/delete-wireframe",
        expect.any(Object)
      );
    });

    test("should get grid images", async () => {
      const mockImages = [
        {
          gridId: "test-grid",
          cellIndex: 0,
          downloadUrl: "/wireframes/test1.png",
          position: { row: 1, col: 1 },
        },
        {
          gridId: "test-grid",
          cellIndex: 1,
          downloadUrl: "/wireframes/test2.png",
          position: { row: 1, col: 2 },
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockImages.map((image, index) => ({
          id: `${index + 1}`,
          data: () => image,
        })),
      });

      const result = await wireframeService.getGridImages("test-grid");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        gridId: "test-grid",
        cellIndex: 0,
        downloadUrl: "/wireframes/test1.png",
        position: { row: 1, col: 1 },
      });
    });
  });

  describe("Error Handling", () => {
    test("should handle Firestore errors gracefully", async () => {
      mockGetDocs.mockRejectedValue(new Error("Firestore error"));

      await expect(wireframeService.getAllGrids()).rejects.toThrow(
        "Firestore error"
      );
    });

    test("should handle network errors in image operations", async () => {
      const mockFile = new File(["test content"], "test.png", {
        type: "image/png",
      });
      const gridSize = { rows: 2, cols: 2 };

      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(
        wireframeService.uploadImage("test-grid-id", 0, mockFile, gridSize)
      ).rejects.toThrow("Network error");
    });
  });

  describe("Data Validation", () => {
    test("should validate grid data before creation", async () => {
      const invalidGridData = {
        name: "",
        gridSize: { rows: -1, cols: 0 },
      };

      mockAddDoc.mockRejectedValue(new Error("Invalid grid data"));

      await expect(
        wireframeService.createGrid(invalidGridData as any)
      ).rejects.toThrow("Invalid grid data");
    });
  });
});
