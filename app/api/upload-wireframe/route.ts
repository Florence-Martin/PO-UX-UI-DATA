import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  assertAllowedWireframeExtension,
  assertAllowedWireframeFileSize,
  assertAllowedWireframeMimeType,
  resolveWireframePath,
  sanitizeWireframeFileName,
} from "@/lib/utils/wireframeFileValidation";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const rawFileName = data.get("fileName");

    if (!(file instanceof File) || typeof rawFileName !== "string") {
      return NextResponse.json(
        { error: "Fichier ou nom manquant" },
        { status: 400 }
      );
    }

    const fileName = sanitizeWireframeFileName(rawFileName);
    assertAllowedWireframeExtension(fileName);
    assertAllowedWireframeMimeType(file.type);
    assertAllowedWireframeFileSize(file.size);

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const filePath = resolveWireframePath(fileName);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Fichier uploadé avec succès",
      filePath: `public/wireframes/${fileName}`,
      url: `/wireframes/${fileName}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Fichier trop volumineux") {
        return NextResponse.json({ error: error.message }, { status: 413 });
      }

      if (
        error.message === "Nom de fichier invalide" ||
        error.message === "Chemin non autorisé" ||
        error.message === "Nom de fichier non autorisé" ||
        error.message === "Extension non autorisée" ||
        error.message === "Type MIME non autorisé"
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
