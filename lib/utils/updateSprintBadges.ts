import {
  getAllBacklogTasks,
  updateBacklogTask,
} from "@/lib/services/backlogTasksService";

/**
 * Met à jour dynamiquement le badge "sprint" dans les tâches liées aux US d'un sprint.
 * Supprime le badge si l'US n’est plus dans un sprint.
 */
export async function updateBadgesForSprintUserStories(userStoryIds: string[]) {
  const allTasks = await getAllBacklogTasks();

  const updates = allTasks.map(async (task) => {
    const hasLinkedUS = task.userStoryIds?.some((id) =>
      userStoryIds.includes(id)
    );
    const shouldHaveBadge = hasLinkedUS;

    const alreadyHasBadge = task.badge === "sprint";

    if (shouldHaveBadge && !alreadyHasBadge) {
      return updateBacklogTask(task.id!, { ...task, badge: "sprint" });
    }

    if (!shouldHaveBadge && alreadyHasBadge) {
      return updateBacklogTask(task.id!, { ...task, badge: null });
    }

    return null; // Pas de changement
  });

  await Promise.all(updates);
}
