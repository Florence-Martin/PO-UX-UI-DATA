import {
  assertAllowedWireframeExtension,
  assertAllowedWireframeFileSize,
  assertAllowedWireframeMimeType,
  resolveWireframePath,
  sanitizeWireframeFileName,
} from "@/lib/utils/wireframeFileValidation";

describe("wireframeFileValidation", () => {
  describe("sanitizeWireframeFileName", () => {
    it("accepts a valid file name", () => {
      expect(sanitizeWireframeFileName("test-image.png")).toBe(
        "test-image.png"
      );
    });

    it("rejects empty file name", () => {
      expect(() => sanitizeWireframeFileName("")).toThrow(
        "Nom de fichier invalide"
      );
    });

    it("rejects path traversal", () => {
      expect(() => sanitizeWireframeFileName("../evil.png")).toThrow(
        "Chemin non autorisé"
      );
    });

    it("rejects invalid characters", () => {
      expect(() => sanitizeWireframeFileName("test image.png")).toThrow(
        "Nom de fichier non autorisé"
      );
    });
  });

  describe("assertAllowedWireframeExtension", () => {
    it("accepts allowed extensions", () => {
      expect(() => assertAllowedWireframeExtension("a.png")).not.toThrow();
      expect(() => assertAllowedWireframeExtension("a.jpg")).not.toThrow();
      expect(() => assertAllowedWireframeExtension("a.jpeg")).not.toThrow();
      expect(() => assertAllowedWireframeExtension("a.webp")).not.toThrow();
    });

    it("rejects svg", () => {
      expect(() => assertAllowedWireframeExtension("a.svg")).toThrow(
        "Extension non autorisée"
      );
    });
  });

  describe("assertAllowedWireframeMimeType", () => {
    it("accepts allowed mime types", () => {
      expect(() => assertAllowedWireframeMimeType("image/png")).not.toThrow();
      expect(() => assertAllowedWireframeMimeType("image/jpeg")).not.toThrow();
      expect(() => assertAllowedWireframeMimeType("image/webp")).not.toThrow();
    });

    it("rejects invalid mime types", () => {
      expect(() => assertAllowedWireframeMimeType("image/svg+xml")).toThrow(
        "Type MIME non autorisé"
      );
    });
  });

  describe("assertAllowedWireframeFileSize", () => {
    it("accepts files up to 5 MB", () => {
      expect(() =>
        assertAllowedWireframeFileSize(5 * 1024 * 1024)
      ).not.toThrow();
    });

    it("rejects files larger than 5 MB", () => {
      expect(() => assertAllowedWireframeFileSize(5 * 1024 * 1024 + 1)).toThrow(
        "Fichier trop volumineux"
      );
    });
  });

  describe("resolveWireframePath", () => {
    it("resolves inside public/wireframes", () => {
      expect(resolveWireframePath("test.png")).toContain(
        "public/wireframes/test.png"
      );
    });
  });
});
