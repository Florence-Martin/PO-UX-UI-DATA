/**
 * @jest-environment jsdom
 */

import { getTemplate, saveTemplate } from "../../lib/services/templateService";

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

jest.mock("firebase/firestore", () => ({
  doc: mockDoc,
  getDoc: mockGetDoc,
  setDoc: mockSetDoc,
}));

describe("templateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
