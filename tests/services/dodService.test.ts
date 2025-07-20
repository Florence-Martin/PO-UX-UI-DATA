/**
 * @jest-environment jsdom
 */

import {
  getDoD,
  updateDoD,
  updateDoDItemStatus,
} from "../../lib/services/dodService";

// Mock Firebase
jest.mock("../../lib/firebase", () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firestore functions
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockDoc = jest.fn();
const mockServerTimestamp = jest.fn();

jest.mock("firebase/firestore", () => ({
  doc: mockDoc,
  getDoc: mockGetDoc,
  setDoc: mockSetDoc,
  serverTimestamp: mockServerTimestamp,
  onSnapshot: jest.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
}));

describe("dodService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServerTimestamp.mockReturnValue({ toDate: () => new Date() });
  });

  describe("getDoD", () => {
    it("should return existing DoD from Firestore", async () => {
      const mockDoD = {
        id: "default",
        items: [
          { id: "1", text: "Code reviewed", checked: false, order: 0 },
          { id: "2", text: "Tests written", checked: false, order: 1 },
        ],
        lastUpdated: { toDate: () => new Date() } as any,
        lastUpdatedBy: "test-user",
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockDoD,
      });

      const result = await getDoD();

      expect(result).toEqual(mockDoD);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "definitionOfDone",
        "default"
      );
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("should create and return default DoD when none exists", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await getDoD();

      expect(result.id).toBe("default");
      expect(result.items).toHaveLength(6); // Default items
      expect(mockSetDoc).toHaveBeenCalled();
    });
  });

  describe("updateDoD", () => {
    it("should update DoD in Firestore", async () => {
      const dod = {
        id: "default",
        items: [{ id: "1", text: "Updated item", checked: true, order: 0 }],
        lastUpdated: { toDate: () => new Date() } as any,
        lastUpdatedBy: "test-user",
      };

      await updateDoD(dod);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "definitionOfDone",
        "default"
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...dod,
          updatedAt: expect.anything(),
        })
      );
    });
  });

  describe("updateDoDItemStatus", () => {
    it("should update specific DoD item status", async () => {
      const existingDoD = {
        id: "default",
        items: [
          { id: "1", text: "Item 1", checked: false, order: 0 },
          { id: "2", text: "Item 2", checked: false, order: 1 },
        ],
        lastUpdated: { toDate: () => new Date() } as any,
        lastUpdatedBy: "test-user",
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => existingDoD,
      });

      await updateDoDItemStatus("default", "1", true);

      expect(mockGetDoc).toHaveBeenCalled();
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ id: "1", checked: true }),
            expect.objectContaining({ id: "2", checked: false }),
          ]),
          updatedAt: expect.anything(),
        })
      );
    });
  });
});
