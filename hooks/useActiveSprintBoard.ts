// import { useUserStories } from "@/hooks/useUserStories";
// import { useSprints } from "@/hooks/useSprints";
// import { Task } from "@/lib/types/task";

// export function useActiveSprintBoard() {
//   const { userStories, loading: loadingUS } = useUserStories();
//   const { currentSprint } = useSprints();

//   // Indique si les données sont en cours de chargement
//   const isLoading = loadingUS || !currentSprint;

//   // Récupère les User Stories du sprint actif
//   const sprintUserStories = currentSprint
//     ? userStories.filter((us) => currentSprint.userStoryIds?.includes(us.id!))
//     : [];

//   // Rassemble toutes les tâches du sprint actif
//   const allTasks: Task[] = sprintUserStories.flatMap((us) =>
//     (us.task ?? []).map((task) => ({
//       ...task,
//       userStory: {
//         id: us.id,
//         code: us.code,
//         title: us.title,
//         priority: us.priority,
//         moscow: us.moscow,
//       },
//     }))
//   );

//   // Trie les tâches par statut
//   const tasksByStatus = {
//     todo: allTasks.filter((t) => t.status === "todo"),
//     "in-progress": allTasks.filter((t) => t.status === "in-progress"),
//     "in-testing": allTasks.filter((t) => t.status === "in-testing"),
//     done: allTasks.filter((t) => t.status === "done"),
//   };

//   // Calcul des points complétés / totaux
//   const totalPoints = allTasks.reduce(
//     (sum, t) => sum + (t.storyPoints || 0),
//     0
//   );
//   const completedPoints = tasksByStatus["done"].reduce(
//     (sum, t) => sum + (t.storyPoints || 0),
//     0
//   );
//   const progress =
//     totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

//   return {
//     currentSprint,
//     sprintUserStories,
//     tasksByStatus,
//     completedPoints,
//     totalPoints,
//     progress,
//     isLoading,
//   };
// }
