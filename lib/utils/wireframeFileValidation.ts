import path from "path";

export const ALLOWED_WIREFRAME_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
]);

export const ALLOWED_WIREFRAME_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const MAX_WIREFRAME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function buildValidationError(message: string) {
  return new Error(message);
}

export function sanitizeWireframeFileName(rawFileName: string): string {
  if (typeof rawFileName !== "string" || rawFileName.trim() === "") {
    throw buildValidationError("Nom de fichier invalide");
  }

  const fileName = path.basename(rawFileName);

  if (fileName !== rawFileName) {
    throw buildValidationError("Chemin non autorisé");
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    throw buildValidationError("Nom de fichier non autorisé");
  }

  return fileName;
}

export function assertAllowedWireframeExtension(fileName: string): void {
  const ext = path.extname(fileName).toLowerCase();

  if (!ALLOWED_WIREFRAME_EXTENSIONS.has(ext)) {
    throw buildValidationError("Extension non autorisée");
  }
}

export function assertAllowedWireframeMimeType(mimeType: string): void {
  if (!ALLOWED_WIREFRAME_MIME_TYPES.has(mimeType)) {
    throw buildValidationError("Type MIME non autorisé");
  }
}

export function assertAllowedWireframeFileSize(size: number): void {
  if (size > MAX_WIREFRAME_FILE_SIZE_BYTES) {
    throw buildValidationError("Fichier trop volumineux");
  }
}

export function resolveWireframePath(fileName: string): string {
  const wireframesDir = path.resolve(process.cwd(), "public", "wireframes");
  const resolvedPath = path.resolve(wireframesDir, fileName);

  if (
    resolvedPath !== wireframesDir &&
    !resolvedPath.startsWith(`${wireframesDir}${path.sep}`)
  ) {
    throw buildValidationError("Chemin non autorisé");
  }

  return resolvedPath;
}
