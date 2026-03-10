import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const fileName = body?.fileName;

    if (typeof fileName !== "string" || fileName.trim() === "") {
      return NextResponse.json(
        { error: "Nom de fichier invalide" },
        { status: 400 }
      );
    }

    // Autoriser uniquement un nom de fichier simple
    // ex: wireframe-123.png
    const isValidFileName = /^[a-zA-Z0-9._-]+$/.test(fileName);

    if (!isValidFileName) {
      return NextResponse.json(
        { error: "Nom de fichier non autorisé" },
        { status: 400 }
      );
    }

    const baseDir = path.resolve(process.cwd(), "public", "wireframes");
    const targetPath = path.resolve(baseDir, fileName);

    // Vérifie que le fichier reste bien dans le dossier autorisé
    if (!targetPath.startsWith(baseDir + path.sep) && targetPath !== baseDir) {
      return NextResponse.json(
        { error: "Chemin non autorisé" },
        { status: 400 }
      );
    }

    try {
      await unlink(targetPath);

      return NextResponse.json({
        message: "Fichier supprimé avec succès",
      });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return NextResponse.json({
          message: "Fichier déjà supprimé",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Erreur suppression:", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
