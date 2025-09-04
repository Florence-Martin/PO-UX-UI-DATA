import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: "Nom de fichier manquant" },
        { status: 400 }
      );
    }

    // Chemin du fichier à supprimer
    const filePath = path.join(process.cwd(), "public", "wireframes", fileName);

    try {
      // Supprimer le fichier
      await unlink(filePath);
      return NextResponse.json({ message: "Fichier supprimé avec succès" });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // Fichier n'existe pas, c'est ok
        return NextResponse.json({ message: "Fichier déjà supprimé" });
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
