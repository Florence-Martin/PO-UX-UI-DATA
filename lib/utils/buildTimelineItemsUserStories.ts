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
  const addedUserStoryIds = new Set<string>();

  backlogTasks.forEach((task) => {
    if (task.badge !== "sprint") return;
    if (!task.userStoryIds || task.userStoryIds.length === 0) return;

    const userStoryId = task.userStoryIds[0];
    if (addedUserStoryIds.has(userStoryId)) return;

    const userStory = userStories.find((us) => us.id === userStoryId);
    if (!userStory) return;

    const status = task.status ?? "todo";

    const matchingSprint = sprints.find((sprint) =>
      sprint.userStoryIds?.includes(userStoryId)
    );

    // ✅ Correction ici : bien formatter le startDate (Timestamp ou Date ou string)
    const date = matchingSprint?.startDate || userStory.createdAt;

    items.push({
      id: userStory.id,
      title: userStory.title,
      code: userStory.code || "",
      description: userStory.description || "",
      date: getFormattedDate(date),
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
