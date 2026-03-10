import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import {
  assertAllowedWireframeExtension,
  resolveWireframePath,
  sanitizeWireframeFileName,
} from "@/lib/utils/wireframeFileValidation";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const rawFileName = body?.fileName;

    const fileName = sanitizeWireframeFileName(rawFileName);
    assertAllowedWireframeExtension(fileName);
    const fileToDelete = resolveWireframePath(fileName);

    try {
      await unlink(fileToDelete);

      return NextResponse.json({
        message: "Fichier supprimé avec succès",
      });
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        return NextResponse.json(
          {
            error:
              "Fichier introuvable, suppression Firestore non effectuée automatiquement",
          },
          { status: 404 }
        );
      }

      throw error;
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Nom de fichier invalide" ||
        error.message === "Chemin non autorisé" ||
        error.message === "Nom de fichier non autorisé" ||
        error.message === "Extension non autorisée")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Erreur suppression:", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
