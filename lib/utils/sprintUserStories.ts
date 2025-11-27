import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";

/**
 * ✅ Fonction utilitaire pour récupérer les User Stories d'un sprint
 *
 * GESTION DE LA DOUBLE SOURCE DE VÉRITÉ :
 * -----------------------------------------
 * Il existe deux façons de relier un sprint à ses User Stories :
 *
 * 1. PUSH (depuis le sprint) : sprint.userStoryIds = ["us1", "us2", "us3"]
 *    → Le sprint contient la liste des IDs de ses User Stories
 *    → Filtrage : userStories.filter(us => sprint.userStoryIds.includes(us.id))
 *
 * 2. PULL (depuis l'User Story) : userStory.sprintId = "sprint_id"
 *    → Chaque User Story référence son sprint
 *    → Filtrage : userStories.filter(us => us.sprintId === sprint.id)
 *
 * LOGIQUE IMPLÉMENTÉE :
 * ----------------------
 * - Priorité 1 : Si sprint.userStoryIds existe et est non vide → utiliser cette liste (PUSH)
 * - Fallback : Sinon → filtrer par us.sprintId === sprint.id (PULL)
 *
 * Cette fonction CENTRALISE la gestion de cette double source de vérité
 * pour éviter les incohérences entre les différents composants.
 *
 * @param activeSprint - Le sprint actif (peut être null si aucun sprint actif)
 * @param userStories - La liste complète des User Stories
 * @returns La liste des User Stories appartenant au sprint actif
 */
export function getUserStoriesForSprint(
  activeSprint: Sprint | null,
  userStories: UserStory[]
): UserStory[] {
  // Si pas de sprint actif, retourner un tableau vide
  if (!activeSprint) {
    return [];
  }

  // CAS 1 : PUSH - Le sprint contient la liste des IDs (sprint.userStoryIds)
  // Avantage : Plus performant, source de vérité unique dans le sprint
  if (activeSprint.userStoryIds && activeSprint.userStoryIds.length > 0) {
    return userStories.filter((us) =>
      activeSprint.userStoryIds!.includes(us.id)
    );
  }

  // CAS 2 : PULL - Chaque User Story référence son sprint (us.sprintId)
  // Fallback si sprint.userStoryIds est vide ou non défini
  return userStories.filter((us) => us.sprintId === activeSprint.id);
}

/**
 * Fonction utilitaire pour filtrer les tâches d'un sprint
 *
 * RÈGLE MÉTIER :
 * --------------
 * Une tâche appartient à un sprint si elle est liée à au moins une User Story
 * qui appartient à ce sprint.
 *
 * SOURCE DE VÉRITÉ :
 * ------------------
 * - task.userStoryIds (liste des IDs d'User Stories liées à la tâche)
 * - sprintUserStoryIds (IDs des User Stories du sprint, obtenus via getUserStoriesForSprint)
 *
 * IMPORTANT :
 * -----------
 * Le champ badge n'est PLUS utilisé comme critère de filtrage.
 * Il peut rester décoratif (icône, couleur) mais n'affecte pas la logique métier.
 *
 * @param tasks - La liste complète des tâches
 * @param sprintUserStoryIds - Les IDs des User Stories du sprint actif
 * @returns Les tâches appartenant au sprint actif
 */
export function getTasksForSprint(
  tasks: any[],
  sprintUserStoryIds: string[]
): any[] {
  // Si pas d'User Stories dans le sprint, retourner un tableau vide
  if (sprintUserStoryIds.length === 0) {
    return [];
  }

  // Filtrer les tâches qui ont au moins une User Story du sprint
  // Intersection : task.userStoryIds ∩ sprintUserStoryIds ≠ ∅
  return tasks.filter((task) =>
    task.userStoryIds?.some((id: string) => sprintUserStoryIds.includes(id))
  );
}
