import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const fileName: string | null = data.get("fileName") as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Fichier ou nom manquant" },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Chemin de destination
    const filePath = path.join(process.cwd(), "public", "wireframes", fileName);

    // Écrire le fichier
    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Fichier uploadé avec succès",
      filePath: `public/wireframes/${fileName}`,
      url: `/wireframes/${fileName}`,
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
