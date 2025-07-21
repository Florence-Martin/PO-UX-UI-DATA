import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createPersona,
  deletePersona,
  getAllPersonas,
  getPersona,
  Persona,
  savePersona,
} from "../../lib/services/personaService";

// Mock Firebase
jest.mock("firebase/firestore");
jest.mock("../../lib/firebase", () => ({
  db: {},
}));

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

describe("PersonaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations
    mockSetDoc.mockResolvedValue(undefined);
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  const mockPersonas: Persona[] = [
    {
      id: "persona_1640995200000",
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Tech Corp",
      goals: "Deliver successful products on time",
      pains: "Lack of user feedback, unclear requirements",
      needs: "Better collaboration tools, clear project roadmaps",
      channels: "Slack, Email, In-person meetings",
    },
    {
      id: "persona_1640995300000",
      name: "Mike Developer",
      role: "Senior Developer",
      company: "StartupXYZ",
      goals: "Write clean, maintainable code",
      pains: "Technical debt, changing requirements",
      needs: "Clear specifications, modern development tools",
      channels: "GitHub, Slack, Video calls",
    },
  ];

  describe("createPersona", () => {
    it("should create a new persona with generated ID", async () => {
      const newPersonaData = {
        name: "Alex Designer",
        role: "UX Designer",
        company: "Design Studio",
        goals: "Create intuitive user experiences",
        pains: "Limited user research, tight deadlines",
        needs: "User research data, design systems",
        channels: "Figma, Slack, User interviews",
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      // Mock Date.now to get predictable ID
      const mockTimestamp = 1640995400000;
      jest.spyOn(Date, "now").mockReturnValue(mockTimestamp);

      const result = await createPersona(newPersonaData);

      expect(mockDoc).toHaveBeenCalledWith(
        {},
        "user_research_personas",
        `persona_${mockTimestamp}`
      );
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        id: `persona_${mockTimestamp}`,
        ...newPersonaData,
      });
      expect(result).toBe(`persona_${mockTimestamp}`);

      // Restore Date.now
      jest.restoreAllMocks();
    });

    it("should handle Firebase errors during creation", async () => {
      const newPersonaData = {
        name: "Test Persona",
        role: "Test Role",
        company: "Test Company",
        goals: "Test goals",
        pains: "Test pains",
        needs: "Test needs",
        channels: "Test channels",
      };

      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockRejectedValue(new Error("Creation failed"));

      await expect(createPersona(newPersonaData)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("getAllPersonas", () => {
    it("should return all personas", async () => {
      const mockQuerySnapshot = {
        docs: mockPersonas.map((persona) => ({
          data: () => persona,
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllPersonas();

      expect(mockCollection).toHaveBeenCalledWith({}, "user_research_personas");
      expect(mockGetDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Sarah Johnson");
      expect(result[1].name).toBe("Mike Developer");
    });

    it("should return empty array when no personas exist", async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getAllPersonas();

      expect(result).toEqual([]);
    });

    it("should handle Firebase errors gracefully", async () => {
      mockGetDocs.mockRejectedValue(new Error("Firebase error"));

      await expect(getAllPersonas()).rejects.toThrow("Firebase error");
    });
  });

  describe("getPersona", () => {
    it("should return persona by id when it exists", async () => {
      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockPersonas[0],
      };

      mockGetDoc.mockResolvedValue(mockDocSnapshot as any);

      const result = await getPersona("persona_1640995200000");

      expect(mockDoc).toHaveBeenCalledWith(
        {},
        "user_research_personas",
        "persona_1640995200000"
      );
      expect(mockGetDoc).toHaveBeenCalled();
      expect(result).toEqual(mockPersonas[0]);
    });

    it("should return null when persona does not exist", async () => {
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValue(mockDocSnapshot as any);

      const result = await getPersona("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle Firebase errors during get", async () => {
      mockGetDoc.mockRejectedValue(new Error("Get failed"));

      await expect(getPersona("persona_1640995200000")).rejects.toThrow(
        "Get failed"
      );
    });
  });

  describe("savePersona", () => {
    it("should save persona data", async () => {
      const personaId = "persona_1640995200000";
      const updateData = {
        name: "Sarah Johnson Updated",
        role: "Senior Product Manager",
        company: "Tech Corp",
        goals: "Lead product strategy and deliver successful products",
        pains: "Limited resources, competing priorities",
        needs: "Executive support, clear metrics",
        channels: "Slack, Email, Executive meetings",
      };

      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      await savePersona(personaId, updateData);

      expect(mockDoc).toHaveBeenCalledWith(
        {},
        "user_research_personas",
        personaId
      );
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        id: personaId,
        ...updateData,
      });
    });

    it("should handle Firebase errors during save", async () => {
      const updateData = {
        name: "Test Update",
        role: "Test Role",
        company: "Test Company",
        goals: "Test goals",
        pains: "Test pains",
        needs: "Test needs",
        channels: "Test channels",
      };

      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockRejectedValue(new Error("Save failed"));

      await expect(savePersona("persona_test", updateData)).rejects.toThrow(
        "Save failed"
      );
    });
  });

  describe("deletePersona", () => {
    it("should delete a persona by id", async () => {
      const personaId = "persona_1640995200000";
      const mockDocRef = {};
      mockDoc.mockReturnValue(mockDocRef as any);

      await deletePersona(personaId);

      expect(mockDoc).toHaveBeenCalledWith(
        {},
        "user_research_personas",
        personaId
      );
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it("should handle Firebase errors during deletion", async () => {
      mockDoc.mockReturnValue({} as any);
      mockDeleteDoc.mockRejectedValue(new Error("Deletion failed"));

      await expect(deletePersona("persona_test")).rejects.toThrow(
        "Deletion failed"
      );
    });
  });

  describe("Data validation and edge cases", () => {
    it("should handle empty persona data gracefully", async () => {
      const emptyPersonaData = {
        name: "",
        role: "",
        company: "",
        goals: "",
        pains: "",
        needs: "",
        channels: "",
      };

      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      await savePersona("persona_empty", emptyPersonaData);

      expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), {
        id: "persona_empty",
        ...emptyPersonaData,
      });
    });

    it("should preserve data types during operations", async () => {
      const personaData = {
        name: "Type Test",
        role: "Tester",
        company: "Test Co",
        goals: "Ensure type safety",
        pains: "Type mismatches",
        needs: "Strong typing",
        channels: "TypeScript, Tests",
      };

      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      await savePersona("persona_types", personaData);

      const callArgs = mockSetDoc.mock.calls[0][1] as any;
      expect(typeof callArgs.name).toBe("string");
      expect(typeof callArgs.role).toBe("string");
      expect(typeof callArgs.company).toBe("string");
      expect(callArgs.id).toBe("persona_types");
    });

    it("should handle special characters in persona data", async () => {
      const personaWithSpecialChars = {
        name: "José María Ñoño",
        role: "Senior Developer & Team Lead",
        company: "Café & Code Ltd.",
        goals: "Build amazing products (with 100% quality!)",
        pains: "Legacy code & technical debt",
        needs: "Modern tools & better processes",
        channels: "Slack @channel, email, face-to-face",
      };

      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      await savePersona("persona_special", personaWithSpecialChars);

      const callArgs = mockSetDoc.mock.calls[0][1] as any;
      expect(callArgs.name).toBe("José María Ñoño");
      expect(callArgs.company).toBe("Café & Code Ltd.");
    });
  });

  describe("Integration scenarios", () => {
    it("should handle rapid successive persona creations", async () => {
      const personas = [
        { name: "Persona 1", role: "Role 1" },
        { name: "Persona 2", role: "Role 2" },
        { name: "Persona 3", role: "Role 3" },
      ];

      const mockTimestamps = [1640995400000, 1640995401000, 1640995402000];
      let callCount = 0;

      jest
        .spyOn(Date, "now")
        .mockImplementation(() => mockTimestamps[callCount++]);
      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      const results = await Promise.all(
        personas.map((persona) =>
          createPersona({
            ...persona,
            company: "Test Co",
            goals: "Test goals",
            pains: "Test pains",
            needs: "Test needs",
            channels: "Test channels",
          })
        )
      );

      expect(results).toEqual([
        "persona_1640995400000",
        "persona_1640995401000",
        "persona_1640995402000",
      ]);
      expect(mockSetDoc).toHaveBeenCalledTimes(3);

      jest.restoreAllMocks();
    });

    it("should handle persona lifecycle: create, read, update, delete", async () => {
      const initialData = {
        name: "Lifecycle Test",
        role: "Test User",
        company: "Test Corp",
        goals: "Complete lifecycle",
        pains: "Incomplete tests",
        needs: "Full coverage",
        channels: "All channels",
      };

      // Mock creation
      jest.spyOn(Date, "now").mockReturnValue(1640995500000);
      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined); // Ensure success

      const personaId = await createPersona(initialData);
      expect(personaId).toBe("persona_1640995500000");

      // Mock read
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ id: personaId, ...initialData }),
      };
      mockGetDoc.mockResolvedValue(mockDocSnapshot as any);

      const retrievedPersona = await getPersona(personaId);
      expect(retrievedPersona?.name).toBe("Lifecycle Test");

      // Mock update
      const updatedData = { ...initialData, name: "Updated Lifecycle Test" };
      await savePersona(personaId, updatedData);

      // Mock delete
      mockDeleteDoc.mockResolvedValue(undefined); // Ensure success
      await deletePersona(personaId);

      expect(mockSetDoc).toHaveBeenCalledTimes(2); // create + update
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);

      jest.restoreAllMocks();
    });
  });
});
