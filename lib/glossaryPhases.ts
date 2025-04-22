export const Phases = [
  "Discovery",
  "Vision Produit",
  "Design & Cadrage",
  "Planification & Estimation",
  "Exécution Agile (Scrum/Kanban)",
  "Suivi, validation & amélioration continue",
  "Rôles clés",
] as const;

export type GlossaryPhases = (typeof Phases)[number];

export const phaseTextColorMap: Record<GlossaryPhases, string> = {
  Discovery: "text-blue-500",
  "Vision Produit": "text-red-500",
  "Design & Cadrage": "text-green-500",
  "Planification & Estimation": "text-yellow-500",
  "Exécution Agile (Scrum/Kanban)": "text-pink-500",
  "Suivi, validation & amélioration continue": "text-cyan-500",
  "Rôles clés": "text-lime-500",
};
