// hooks/useScenarioLogic.ts
import { Scenario } from "@/lib/services/scenarioService";
import { Timestamp } from "firebase/firestore";

export const cleanList = (list: string[]): string[] => {
  try {
    return Array.from(
      new Set(list.map((item) => item.trim()).filter((item) => item.length > 0))
    ).sort((a, b) => a.localeCompare(b));
  } catch (err) {
    console.error("Erreur dans cleanList :", err);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Cette fonction permet de parser un scénario brut en un objet structuré
export const parseScenario = (raw: string): Omit<Scenario, "id"> => {
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
        if (stopLabels.some((l) => line.startsWith(l))) break;
        if (line.startsWith("-")) items.push(line.slice(1).trim());
      }
      return items;
    };

    return {
      title: getLine("Titre :"),
      context: getLine("Contexte :"),
      objective: getLine("Objectif :"),
      expectedInsights: cleanList(
        extractList("Enjeux / apprentissages attendus :", [
          "Persona associé :",
          "KPI ciblé :",
        ])
      ),
      associatedPersonaId: getLine("Persona associé :"),
      targetKPI: getLine("KPI ciblé :"),
      testedComponents: cleanList(
        extractList("Composants testés :", ["Points de friction observés :"])
      ),
      painPointsObserved: cleanList(
        extractList("Points de friction observés :", ["Notes :"])
      ),
      notes: getLine("Notes :"),
      createdAt: new Date() as unknown as Timestamp, // Default value for createdAt
      updatedAt: new Date() as unknown as Timestamp, // Default value for updatedAt
    };
  } catch (err) {
    console.error("Erreur dans parseScenario:", err);
    throw new Error("Impossible de parser le scénario. Vérifiez le format.");
  }
};

// Cette fonction permet de formater un scénario structuré en une chaîne de caractères
export const formatScenario = (scenario: Scenario): string => {
  try {
    const formatList = (input: string[]): string =>
      input.map((item) => `- ${item.trim()}`).join("\n");

    return `
Titre : ${scenario.title}
Contexte : ${scenario.context}
Objectif : ${scenario.objective}

Enjeux / apprentissages attendus :
${formatList(scenario.expectedInsights)}

Persona associé : ${scenario.associatedPersonaId}
KPI ciblé : ${scenario.targetKPI}

Composants testés :
${formatList(scenario.testedComponents)}

Points de friction observés :
${formatList(scenario.painPointsObserved)}

Notes : ${scenario.notes}
`.trim();
  } catch (err) {
    console.error("Erreur dans formatScenario:", err);
    throw new Error("Impossible de formater le scénario.");
  }
};
