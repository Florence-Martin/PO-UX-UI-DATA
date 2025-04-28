import { BacklogTask } from "@/lib/types/backlogTask";
import { taskStatusMapping } from "@/lib/utils/taskStatusMapping";

// Définition des différents statuts possibles pour le planning scrum
export type SprintStatus = "planned" | "active" | "review" | "retrospective";

/**
 * Fonction pour calculer le statut d'un sprint en fonction des statuts des tâches du backlog.
 * @param tasks - Liste des tâches du backlog
 * @returns Le statut du sprint : "planned", "active", "review", ou "retrospective"
 */
export function computeSprintStatus(tasks: BacklogTask[]): SprintStatus {
  // Récupère les statuts des tâches en les mappant via `taskStatusMapping`
  const statuses = tasks.map((task) => taskStatusMapping[task.status]);

  // Si toutes les tâches sont terminées, le sprint est prêt pour la Review
  if (statuses.every((status) => status === "Terminé")) {
    return "review"; // Sprint terminé, prêt pour la Review
  }

  // Si au moins une tâche est en cours ou à tester, le sprint est en exécution
  if (
    statuses.some((status) => status === "En cours" || status === "À tester")
  ) {
    return "active"; // Sprint en exécution
  }

  // Si toutes les tâches sont à faire, le sprint est planifié mais pas encore commencé
  if (statuses.every((status) => status === "À faire")) {
    return "planned"; // Sprint pas commencé
  }

  return "planned"; // Fallback safe
}
