import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Timestamp } from "firebase/firestore";
import { formatDateToFrenchString } from "@/lib/utils/formatDateToFrenchString";

export interface TimelineItem {
  id: string;
  title: string;
  code: string;
  description: string;
  date: string;
  startDate?: string;
  endDate?: string;
  section: string;
  userStory: {
    id: string;
    code: string;
    title: string;
  };
}

function mapTaskStatusToSection(status?: string): string {
  if (status === "todo") return "planning";
  if (status === "in-progress" || status === "in-testing") return "execution";
  if (status === "done") return "review";
  return "planning";
}

function getFormattedDate(date?: string | Timestamp | Date): string {
  if (!date) return "";
  if (typeof date === "string") return formatDateToFrenchString(date);
  if (date instanceof Date) return formatDateToFrenchString(date.toISOString());
  if (date instanceof Timestamp)
    return formatDateToFrenchString(date.toDate().toISOString());
  return "";
}

export function buildTimelineItemsUserStories(
  sprints: Sprint[],
  userStories: UserStory[],
  backlogTasks: BacklogTask[]
): TimelineItem[] {
  const items: TimelineItem[] = [];
  const addedKeys = new Set<string>();

  backlogTasks.forEach((task) => {
    if (task.badge !== "sprint") return;
    if (!task.userStoryIds || task.userStoryIds.length === 0) return;

    const userStoryId = task.userStoryIds[0];
    const userStory = userStories.find((us) => us.id === userStoryId);
    if (!userStory) return;

    const status = task.status ?? "todo";
    const uniqueKey = `${userStoryId}-${status}`;
    if (addedKeys.has(uniqueKey)) return;

    const matchingSprint = sprints.find((sprint) =>
      sprint.userStoryIds?.includes(userStoryId)
    );

    const date = matchingSprint?.startDate || userStory.createdAt;

    items.push({
      id: userStory.id,
      title: userStory.title,
      code: userStory.code || "",
      description: task.description || userStory.description || "",
      date: getFormattedDate(date),
      section: mapTaskStatusToSection(status),
      userStory: {
        id: userStory.id,
        code: userStory.code || "",
        title: userStory.title || "",
      },
    });

    addedKeys.add(uniqueKey);
  });

  return items;
}
// export function buildTimelineItemsUserStories(
//   sprints: Sprint[],
//   userStories: UserStory[],
//   backlogTasks: BacklogTask[]
// ): TimelineItem[] {
//   const items: TimelineItem[] = [];
//   const processedUserStoryIds = new Set<string>();

//   // Statuts prioritaires pour l'affichage dans la timeline
//   const statusPriority = ["done", "in-progress", "in-testing", "todo"];

//   // Grouper les tâches par userStoryId
//   const tasksByUserStory: Record<string, BacklogTask[]> = {};

//   backlogTasks.forEach((task) => {
//     if (task.badge !== "sprint") return;
//     if (!task.userStoryIds?.[0]) return;

//     const userStoryId = task.userStoryIds[0];

//     if (!tasksByUserStory[userStoryId]) {
//       tasksByUserStory[userStoryId] = [];
//     }

//     tasksByUserStory[userStoryId].push(task);
//   });

//   Object.entries(tasksByUserStory).forEach(([userStoryId, tasks]) => {
//     if (processedUserStoryIds.has(userStoryId)) return;

//     const userStory = userStories.find((us) => us.id === userStoryId);
//     if (!userStory) return;

//     // Prendre le statut le plus avancé selon la priorité
//     const sortedTasks = tasks.sort(
//       (a, b) =>
//         statusPriority.indexOf(a.status || "todo") -
//         statusPriority.indexOf(b.status || "todo")
//     );

//     const mainTask = sortedTasks[0];
//     const status = mainTask.status || "todo";

//     const sprint = sprints.find((s) => s.userStoryIds?.includes(userStoryId));

//     const date = sprint?.startDate || userStory.createdAt;

//     items.push({
//       id: userStory.id,
//       title: userStory.title,
//       code: userStory.code || "",
//       description: userStory.description || "",
//       date: getFormattedDate(date),
//       section: mapTaskStatusToSection(status),
//       userStory: {
//         id: userStory.id,
//         code: userStory.code || "",
//         title: userStory.title || "",
//       },
//     });

//     processedUserStoryIds.add(userStoryId);
//   });

//   return items;
// }
