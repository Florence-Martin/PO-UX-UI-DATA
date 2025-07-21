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
import { getTemplate, saveTemplate } from "../../lib/services/templateService";

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

describe("templateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock doc pour retourner une référence valide
    mockDoc.mockReturnValue({ id: "template_test" } as any);
  });

  describe("getTemplate", () => {
    it("should return template when it exists", async () => {
      const mockTemplate = {
        id: "template_1",
        title: "Test Template",
        content: "Template content",
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockTemplate,
      });

      const result = await getTemplate("template_1");

      expect(result).toEqual(mockTemplate);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_documents",
        "template_1"
      );
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("should throw error when template does not exist", async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      await expect(getTemplate("non-existent")).rejects.toThrow(
        'Le document "non-existent" n\'existe pas dans Firestore'
      );
    });

    it("should handle Firestore errors", async () => {
      const mockError = new Error("Firestore error");
      mockGetDoc.mockRejectedValue(mockError);

      await expect(getTemplate("template_1")).rejects.toThrow(
        "Firestore error"
      );
    });
  });

  describe("saveTemplate", () => {
    it("should save template to Firestore", async () => {
      const templateId = "template_1";
      const templateData = {
        title: "New Template",
        content: "New content",
      };

      await saveTemplate(templateId, templateData);

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "user_research_documents",
        templateId
      );
      expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), {
        id: templateId,
        ...templateData,
      });
    });

    it("should handle save errors gracefully", async () => {
      const templateId = "template_1";
      const templateData = {
        title: "New Template",
        content: "New content",
      };

      const mockError = new Error("Save error");
      mockSetDoc.mockRejectedValue(mockError);

      // The function catches errors internally, so no exception should be thrown
      await expect(
        saveTemplate(templateId, templateData)
      ).resolves.toBeUndefined();
    });
  });
});
