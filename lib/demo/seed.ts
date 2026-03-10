/**
 * Données seed par défaut (fallback)
 *
 * Utilisées UNIQUEMENT si :
 * - L'import Firestore échoue
 * - Firestore est inaccessible
 *
 * En mode hybride normal, les données Firestore sont importées
 */

export const DEMO_FALLBACK_SEED = {
  // Backlog Tasks (fallback minimal)
  backlog_tasks: [
    {
      id: "fallback_task_001",
      title: "Tâche de démonstration 1",
      description: "Cette tâche est un fallback si Firestore est inaccessible",
      priority: "medium",
      storyPoints: 3,
      status: "todo",
      userStoryIds: [],
      badge: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fallback_task_002",
      title: "Tâche de démonstration 2",
      description: "Exemple de tâche en cours",
      priority: "high",
      storyPoints: 5,
      status: "in-progress",
      userStoryIds: [],
      badge: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  // Personas (fallback minimal)
  user_research_personas: [
    {
      id: "fallback_persona_001",
      name: "Persona de démonstration",
      role: "Utilisateur exemple",
      age: "30 ans",
      goals: "Tester l'application en mode démo",
      frustrations: "Données Firestore non accessibles",
      bio: "Ceci est une persona fallback utilisée si Firestore est inaccessible",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  // Collections vides par défaut (seront peuplées via import Firestore)
  user_stories: [],
  sprints: [],
  user_research_scenarios: [],
  roadmap_quarters: [],
};
