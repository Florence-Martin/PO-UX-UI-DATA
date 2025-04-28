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
  return "planning"; // fallback
}

function getFormattedDate(date?: string | Timestamp): string {
  if (!date) return "";
  if (typeof date === "string") return formatDateToFrenchString(date);
  if (date instanceof Timestamp)
    return formatDateToFrenchString(date.toDate().toISOString());
  return "";
}

export function buildTimelineItemsUserStories(
  sprint: Sprint,
  userStories: UserStory[],
  backlogTasks: BacklogTask[]
): TimelineItem[] {
  const items: TimelineItem[] = [];
  const addedUserStoryIds = new Set<string>(); // Set pour éviter les doublons

  backlogTasks.forEach((task) => {
    // ne prend que les tâches qui sont taguées "Sprint"
    if (task.badge !== "sprint") return;

    // vérifie qu'elles sont liées à une userStory
    if (!task.userStoryIds || task.userStoryIds.length === 0) return;

    const userStoryId = task.userStoryIds[0];
    if (addedUserStoryIds.has(userStoryId)) return;

    const userStory = userStories.find((us) => us.id === userStoryId);
    if (!userStory) return;

    const status = task.status ?? "todo";

    items.push({
      id: userStory.id,
      title: userStory.title,
      code: userStory.code || "",
      description: userStory.description || "",
      date: getFormattedDate(userStory.createdAt),
      section: mapTaskStatusToSection(status),
      userStory: {
        id: userStory.id,
        code: userStory.code || "",
        title: userStory.title || "",
      },
    });

    addedUserStoryIds.add(userStoryId);
  });

  return items;
}
