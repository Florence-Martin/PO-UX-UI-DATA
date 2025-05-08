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
    rawDate?: Date | string;
    id: string;
    code: string;
    title: string;
  };
  rawDate?: Date; // Ajout pour garantir un tri précis
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

  // à partir des tâches du backlog
  backlogTasks.forEach((task) => {
    if (task.badge !== "sprint") return;
    if (!task.userStoryIds || task.userStoryIds.length === 0) return;

    const userStoryId = task.userStoryIds[0];
    if (addedKeys.has(userStoryId)) return;

    const userStory = userStories.find((us) => us.id === userStoryId);
    if (!userStory) return;

    const matchingSprint = sprints.find((sprint) =>
      sprint.userStoryIds?.includes(userStoryId)
    );

    const rawDate = matchingSprint?.startDate || userStory.createdAt;
    const formattedDate = getFormattedDate(rawDate);
    const status = task.status ?? "todo";
    console.log(`[DEBUG] Task: ${task.title} | Status: ${status}`);
    const section = mapTaskStatusToSection(status);
    console.log(`[DEBUG] Mapped Section: ${section} for Task ID: ${task.id}`);

    items.push({
      id: userStory.id,
      title: userStory.title,
      code: userStory.code || "",
      description: task.description || userStory.description || "",
      date: formattedDate,
      startDate: getFormattedDate(matchingSprint?.startDate),
      endDate: getFormattedDate(matchingSprint?.endDate),
      section,

      userStory: {
        id: userStory.id,
        code: userStory.code || "",
        title: userStory.title || "",
      },
      rawDate: rawDate instanceof Timestamp ? rawDate.toDate() : rawDate,
    });

    addedKeys.add(userStory?.id ?? "");
  });

  // User Stories associées à un sprint mais ignorées car leur tâche ne les référence pas (relation inverse)
  userStories.forEach((us) => {
    console.log(
      `[DEBUG] US (fallback): ${us.title} | SprintID: ${us.sprintId}`
    );
    if (!us.sprintId || addedKeys.has(us.id)) return;

    const matchingSprint = sprints.find((s) => s.id === us.sprintId);
    if (!matchingSprint) return;

    const rawDate = matchingSprint.startDate || us.createdAt;
    const formattedDate = getFormattedDate(rawDate);

    items.push({
      id: us.id,
      title: us.title,
      code: us.code || "",
      description: us.description || "",
      date: formattedDate,
      startDate: getFormattedDate(matchingSprint.startDate),
      endDate: getFormattedDate(matchingSprint.endDate),
      section: "planning",

      userStory: {
        id: us.id,
        code: us.code || "",
        title: us.title || "",
      },
      rawDate: rawDate instanceof Timestamp ? rawDate.toDate() : rawDate,
    });

    addedKeys.add(us.id);
  });

  // Tri : section > date
  const sectionOrder = ["planning", "execution", "review"];
  return items.sort((a, b) => {
    const sectionComparison =
      sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section);
    if (sectionComparison !== 0) return sectionComparison;
    return (a.rawDate?.getTime() || 0) - (b.rawDate?.getTime() || 0);
  });
}
