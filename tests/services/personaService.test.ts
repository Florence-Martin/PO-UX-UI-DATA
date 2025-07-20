/**
 * @jest-environment jsdom
 */

import {
  createPersona,
  deletePersona,
  getAllPersonas,
  updatePersona,
} from "../../lib/services/personaService";

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

describe("personaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPersonas", () => {
    it("should return all personas", async () => {
      const mockPersonas = [
        { id: "1", name: "Persona 1", age: 25 },
        { id: "2", name: "Persona 2", age: 35 },
      ];

      mockGetDocs.mockResolvedValue({
        docs: mockPersonas.map((persona) => ({
          id: persona.id,
          data: () => persona,
        })),
      });

      const result = await getAllPersonas();

      expect(result).toEqual(mockPersonas);
      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_personas"
      );
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe("createPersona", () => {
    it("should create a new persona", async () => {
      const newPersona = {
        name: "New Persona",
        age: 30,
        occupation: "Developer",
        goals: ["Goal 1"],
        frustrations: ["Frustration 1"],
      };

      const mockDocRef = { id: "new-persona-id" };
      mockAddDoc.mockResolvedValue(mockDocRef);

      const result = await createPersona(newPersona);

      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_personas"
      );
      expect(mockAddDoc).toHaveBeenCalled();
      expect(result).toBe("new-persona-id");
    });
  });

  describe("updatePersona", () => {
    it("should update a persona", async () => {
      const personaId = "persona-1";
      const updates = { name: "Updated Persona" };

      await updatePersona(personaId, updates);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_personas",
        personaId
      );
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe("deletePersona", () => {
    it("should delete a persona", async () => {
      const personaId = "persona-1";

      await deletePersona(personaId);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_personas",
        personaId
      );
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
