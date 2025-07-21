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

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  deleteRoadmapQuarter,
  getRoadmapQuarters,
  saveRoadmapQuarter,
} from "../../lib/services/roadmapService";

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;

describe("roadmapService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock doc pour retourner une référence valide
    mockDoc.mockReturnValue({ id: "roadmap_test" } as any);
    mockCollection.mockReturnValue({ path: "roadmap" } as any);
  });

  describe("getRoadmapQuarters", () => {
    it("should return all roadmap quarters", async () => {
      const mockQuarters = [
        {
          id: "Q1-2024",
          title: "Q1 2024",
          icon: "🎯",
          iconColor: "blue",
          status: "in-progress" as const,
          productVision: "Vision Q1",
          items: [],
        },
        {
          id: "Q2-2024",
          title: "Q2 2024",
          icon: "🚀",
          iconColor: "green",
          status: "upcoming" as const,
          productVision: "Vision Q2",
          items: [],
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockQuarters.map((quarter) => ({
          id: quarter.id,
          data: () => quarter,
          exists: true,
          metadata: {},
          get: jest.fn(),
          ref: {},
        })),
        size: mockQuarters.length,
        empty: false,
        forEach: jest.fn(),
        metadata: {},
      } as any);

      const result = await getRoadmapQuarters();

      expect(result).toEqual(mockQuarters);
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "roadmap");
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("saveRoadmapQuarter", () => {
    it("should save a roadmap quarter", async () => {
      const quarter = {
        id: "Q1-2024",
        title: "Q1 2024",
        icon: "🎯",
        iconColor: "blue",
        status: "in-progress" as const,
        productVision: "Vision Q1",
        items: [{ label: "Feature A", description: "Description A" }],
      };

      await saveRoadmapQuarter(quarter);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "roadmap",
        "Q1-2024"
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...quarter,
          updatedAt: expect.any(Date),
        }),
        { merge: true }
      );
    });
  });

  describe("deleteRoadmapQuarter", () => {
    it("should delete a roadmap quarter", async () => {
      const quarterId = "Q1-2024";

      await deleteRoadmapQuarter(quarterId);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "roadmap",
        quarterId
      );
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
