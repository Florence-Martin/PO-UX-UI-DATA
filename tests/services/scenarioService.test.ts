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
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  createScenario,
  deleteScenario,
  getAllScenarios,
  getScenario,
  saveScenario,
} from "../../lib/services/scenarioService";

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockServerTimestamp = serverTimestamp as jest.MockedFunction<
  typeof serverTimestamp
>;

describe("scenarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServerTimestamp.mockReturnValue({ toDate: () => new Date() } as any);
    // Mock doc pour retourner une référence valide
    mockDoc.mockReturnValue({ id: "scenario_test" } as any);
    mockCollection.mockReturnValue({ path: "scenarios" } as any);
  });

  describe("getAllScenarios", () => {
    it("should return all scenarios", async () => {
      const mockScenarios = [
        {
          id: "scenario_1",
          title: "Test Scenario 1",
          context: "Context 1",
          objective: "Objective 1",
          expectedInsights: ["Insight 1"],
          associatedPersonaId: "persona_1",
          targetKPI: "KPI 1",
          testedComponents: ["Component 1"],
          painPointsObserved: ["Pain point 1"],
          notes: "Notes 1",
          createdAt: { toDate: () => new Date() },
          updatedAt: { toDate: () => new Date() },
        },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockScenarios.map((scenario) => ({
          id: scenario.id,
          data: () => scenario,
        })),
      });

      const result = await getAllScenarios();

      expect(result).toEqual(mockScenarios);
      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_scenarios"
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("getScenario", () => {
    it("should return a scenario by id", async () => {
      const mockScenario = {
        id: "scenario_1",
        title: "Test Scenario",
        context: "Context",
        objective: "Objective",
        expectedInsights: ["Insight"],
        associatedPersonaId: "persona_1",
        targetKPI: "KPI",
        testedComponents: ["Component"],
        painPointsObserved: ["Pain point"],
        notes: "Notes",
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() },
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockScenario,
      });

      const result = await getScenario("scenario_1");

      expect(result).toEqual(mockScenario);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_scenarios",
        "scenario_1"
      );
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("should return null for non-existent scenario", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await getScenario("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createScenario", () => {
    it("should create a new scenario", async () => {
      const newScenario = {
        title: "New Scenario",
        context: "New Context",
        objective: "New Objective",
        expectedInsights: ["New Insight"],
        associatedPersonaId: "persona_1",
        targetKPI: "New KPI",
        testedComponents: ["New Component"],
        painPointsObserved: ["New Pain point"],
        notes: "New Notes",
      };

      // Mock Date.now to have a predictable ID
      const mockNow = 1234567890;
      jest.spyOn(Date, "now").mockReturnValue(mockNow);

      const result = await createScenario(newScenario);

      expect(result).toBe(`scenario_${mockNow}`);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_scenarios",
        `scenario_${mockNow}`
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          id: `scenario_${mockNow}`,
          ...newScenario,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        })
      );

      // Restore Date.now
      jest.restoreAllMocks();
    });
  });

  describe("saveScenario", () => {
    it("should save a scenario", async () => {
      const scenarioId = "scenario_1";
      const updates = {
        title: "Updated Scenario",
        context: "Updated Context",
        objective: "Updated Objective",
        expectedInsights: ["Updated Insight"],
        associatedPersonaId: "persona_1",
        targetKPI: "Updated KPI",
        testedComponents: ["Updated Component"],
        painPointsObserved: ["Updated Pain point"],
        notes: "Updated Notes",
      };

      await saveScenario(scenarioId, updates);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_scenarios",
        scenarioId
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          id: scenarioId,
          ...updates,
          updatedAt: expect.anything(),
        }),
        { merge: true }
      );
    });
  });

  describe("deleteScenario", () => {
    it("should delete a scenario", async () => {
      const scenarioId = "scenario_1";

      await deleteScenario(scenarioId);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_scenarios",
        scenarioId
      );
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
