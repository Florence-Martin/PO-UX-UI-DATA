"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";

type Props = {
  sprint: Sprint;
  userStories: UserStory[];
};

export function SprintActiveCard({ sprint, userStories }: Props) {
  const getDate = (d: any) => d?.toDate?.() ?? new Date(d);

  const sprintStories = userStories.filter((us) => us.sprintId === sprint.id);
  const velocity = sprintStories.reduce(
    (sum, us) => sum + (us.storyPoints || 0),
    0
  );

  return (
    <div className="border rounded-xl p-4 bg-muted shadow-sm">
      <h2 className="text-xl font-semibold mb-1">{sprint.title}</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Du {format(getDate(sprint.startDate), "dd MMMM yyyy", { locale: fr })}{" "}
        au {format(getDate(sprint.endDate), "dd MMMM yyyy", { locale: fr })}
      </p>
      <p className="text-sm">
        📌 {sprintStories.length} US • {velocity} points
      </p>
    </div>
  );
}
