import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const rawFileName = body?.fileName;

    if (typeof rawFileName !== "string" || rawFileName.trim() === "") {
      return NextResponse.json(
        { error: "Nom de fichier invalide" },
        { status: 400 }
      );
    }

    const fileName = path.basename(rawFileName);

    // Refuse toute valeur contenant un chemin
    if (fileName !== rawFileName) {
      return NextResponse.json(
        { error: "Chemin non autorisé" },
        { status: 400 }
      );
    }

    // Refuse les noms bizarres
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      return NextResponse.json(
        { error: "Nom de fichier non autorisé" },
        { status: 400 }
      );
    }

    const ext = path.extname(fileName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Extension non autorisée" },
        { status: 400 }
      );
    }

    const wireframesDir = path.join(process.cwd(), "public", "wireframes");
    const fileToDelete = path.join(wireframesDir, fileName);

    try {
      await unlink(fileToDelete);

      return NextResponse.json({
        message: "Fichier supprimé avec succès",
      });
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        return NextResponse.json(
          { message: "Fichier déjà supprimé ou introuvable" },
          { status: 404 }
        );
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
