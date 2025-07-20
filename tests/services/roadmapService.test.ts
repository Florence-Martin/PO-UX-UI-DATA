/**
 * @jest-environment jsdom
 */

import {
  deleteRoadmapQuarter,
  getRoadmapQuarters,
  saveRoadmapQuarter,
} from "../../lib/services/roadmapService";

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
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
}));

describe("roadmapService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        })),
      });

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
