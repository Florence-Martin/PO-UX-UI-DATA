/**
 * @jest-environment jsdom
 */

// Mock Firebase AVANT d'importer le service
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ isServerTimestamp: true })),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((date: Date) => ({ toDate: () => date })),
  },
}));

jest.mock("../../lib/firebase", () => ({
  db: {},
}));

import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  getDoD,
  updateDoD,
  updateDoDItemStatus,
} from "../../lib/services/dodService";

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

describe("dodService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock doc pour retourner une référence valide
    mockDoc.mockReturnValue({ id: "default" } as any);
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
          lastUpdated: expect.anything(),
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
          lastUpdated: expect.anything(),
        })
      );
    });
  });
});
