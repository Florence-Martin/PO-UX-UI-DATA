import { UserStoryQualityRequest } from "../types";

const safe = (v?: string) => (v ?? "").trim();

export function buildUserStoryQualityPrompt(
  request: UserStoryQualityRequest
): string {
  const title = safe(request.title);
  const description = safe(request.description);
  const acceptanceCriteria = safe(request.acceptanceCriteria);
  const code = safe(request.code) || "Non défini";
  const priority = safe(request.priority) || "Non définie";

  return [
    "Tu es un expert Product Owner et Quality Analyst.",
    "Tu dois retourner UNIQUEMENT un objet JSON valide.",
    "Règles STRICTES :",
    "- Pas de markdown",
    "- Pas de texte avant/après",
    "- Pas de commentaires",
    "- Toutes les clés doivent être présentes",
    "- Les booléens doivent être des vrais booléens (true/false), pas du texte",
    "- Les nombres doivent être des nombres (pas des strings)",
    "",
    "User Story à analyser :",
    `code: ${code}`,
    `title: ${title || "Non défini"}`,
    `priority: ${priority}`,
    "",
    "description:",
    description || "Non défini",
    "",
    "acceptanceCriteria:",
    acceptanceCriteria || "Non défini",
    "",
    "Consignes d'analyse :",
    "1) Scores (0-10)",
    "- clarity : clarté",
    "- testability : testabilité",
    "- risk : risque d'ambiguïté (0 faible, 10 élevé)",
    "",
    "2) Alerts",
    "- Liste les problèmes actionnables",
    "- severity ∈ {low, medium, high}",
    "- Si des éléments critiques manquent (titre/description/AC), mets au moins 1 alerte high",
    "",
    "3) Questions pour le métier",
    "- 2 à 5 questions ouvertes",
    "",
    "4) Suggestions Gherkin",
    "- 1 à 3 scénarios",
    "- given/when/then doivent être des strings courtes, testables",
    "",
    "5) INVEST",
    "- Tous les champs doivent être présents",
    "- Si info insuffisante, mets false + ajoute une alerte medium ou high",
    "",
    "Format JSON attendu (respecte exactement la structure) :",
    `{
      "scores": {
        "clarity": 0,
        "testability": 0,
        "risk": 0
      },
      "alerts": [
        { "severity": "low", "message": "" }
      ],
      "questionsForBusiness": [""],
      "gherkinSuggestions": [
        { "scenario": "", "given": "", "when": "", "then": "" }
      ],
      "investGuidelines": {
        "independent": false,
        "negotiable": false,
        "valuable": false,
        "estimable": false,
        "small": false,
        "testable": false
      }
    }`,
    "",
    "Retourne UNIQUEMENT le JSON.",
  ].join("\n");
}

export const SYSTEM_PROMPT = [
  "Tu es un assistant IA spécialisé dans l'analyse de qualité des User Stories Agile.",
  "Tu réponds UNIQUEMENT en JSON valide, jamais en texte libre.",
  "Tu respectes strictement la structure demandée.",
].join("\n");
