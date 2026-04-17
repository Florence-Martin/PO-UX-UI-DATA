"use client";

import { useDroppable } from "@dnd-kit/core";
import { UserStory } from "@/lib/types/userStory";
import { PrioritisedUserStoryCard } from "./PrioritisedUserStoryCard";

type Props = {
  label: string;
  stories: UserStory[];
  columnId: string;
  activeStoryId: string | null;
};

export function MoscowColumn({
  label,
  stories,
  columnId,
  activeStoryId,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
    data: {
      columnId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`border p-4 rounded bg-card min-h-[220px] transition-colors ${
        isOver ? "border-primary ring-1 ring-primary/30" : ""
      }`}
    >
      <h3 className="text-lg font-bold capitalize mb-2">{label}</h3>
      {stories.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          Aucune User Story
        </p>
      ) : (
        <div className="space-y-2">
          {stories.map((story) => (
            <PrioritisedUserStoryCard
              key={story.id}
              story={story}
              isDragging={activeStoryId === story.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
