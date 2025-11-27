import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { formatDateToFrenchString } from "@/lib/utils/formatDateToFrenchString";
import { Timestamp } from "firebase/firestore";

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
  // ✅ CORRECTION : Ne plus filtrer par badge="sprint" (badge n'est plus source de vérité)
  // On garde uniquement les tâches liées à des User Stories
  backlogTasks.forEach((task) => {
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

    const section = mapTaskStatusToSection(status);

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
    if (!us.sprintId || addedKeys.has(us.id)) return;

    const matchingSprint = sprints.find((s) => s.id === us.sprintId);
    if (!matchingSprint) return;

    const rawDate = matchingSprint.startDate || us.createdAt;
    const formattedDate = getFormattedDate(rawDate);

    // Si le sprint est actif, on force la section "execution"
    let section: string;
    if (matchingSprint.status === "active") {
      section = "execution";
    } else if (matchingSprint.status === "done") {
      section = "review";
    } else {
      section = "planning";
    }

    items.push({
      id: us.id,
      title: us.title,
      code: us.code || "",
      description: us.description || "",
      date: formattedDate,
      startDate: getFormattedDate(matchingSprint.startDate),
      endDate: getFormattedDate(matchingSprint.endDate),
      section,

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
