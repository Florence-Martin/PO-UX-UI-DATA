import { Persona } from "@/lib/services/personaService";

// Nettoie une liste : supprime doublons et formate proprement
export const cleanList = (list: string[]): string => {
  try {
    return Array.from(
      new Set(list.map((item) => item.trim()).filter((item) => item.length > 0))
    )
      .sort((a, b) => a.localeCompare(b))
      .join(", ");
  } catch (err) {
    console.error("Erreur dans cleanList :", err);
    return ""; // Retourne une chaîne vide en cas d'erreur
  }
};

// ✅ Corrigé : détection fiable des blocs de chaque section
export const parsePersona = (raw: string): Omit<Persona, "id"> => {
  try {
    const lines = raw.split("\n").map((line) => line.trim());

    const getLine = (label: string): string =>
      lines
        .find((line) => line.startsWith(label))
        ?.replace(label, "")
        .trim() || "";

    const extractList = (label: string, stopLabels: string[]): string[] => {
      const startIndex = lines.findIndex((line) => line.startsWith(label));
      if (startIndex === -1) return [];

      const items: string[] = [];

      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        // Dès qu'on atteint une autre section, on stoppe
        if (stopLabels.some((l) => line.startsWith(l))) break;

        if (line.startsWith("-")) {
          items.push(line.slice(1).trim());
        }
      }

      return items;
    };

    return {
      name: getLine("Nom :"),
      role: getLine("Role :"),
      company: getLine("Entreprise :"),
      goals: cleanList(
        extractList("Objectifs :", [
          "Points de friction :",
          "Besoins principaux :",
          "Canaux préférés :",
        ])
      ),
      pains: cleanList(
        extractList("Points de friction :", [
          "Besoins principaux :",
          "Canaux préférés :",
        ])
      ),
      needs: cleanList(
        extractList("Besoins principaux :", ["Canaux préférés :"])
      ),
      channels: cleanList(extractList("Canaux préférés :", [])),
    };
  } catch (err) {
    console.error("Erreur dans parsePersona :", err);
    throw new Error(
      "Impossible de parser le persona. Vérifiez le format des données."
    );
  }
};

// ✅ Affichage structuré : chaque ligne formatée proprement
export const formatPersona = (persona: Persona): string => {
  try {
    const formatList = (input: string): string =>
      input
        .split(",")
        .map((item) => `- ${item.trim()}`)
        .join("\n");

    return `
Nom : ${persona.name}
Role : ${persona.role}
Entreprise : ${persona.company}

Objectifs :
${formatList(persona.goals)}

Points de friction :
${formatList(persona.pains)}

Besoins principaux :
${formatList(persona.needs)}

Canaux préférés :
${formatList(persona.channels)}
`.trim();
  } catch (err) {
    console.error("Erreur dans formatPersona :", err);
    return "Erreur : Impossible de formater le persona.";
  }
};
