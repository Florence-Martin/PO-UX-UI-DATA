"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserStory } from "@/lib/types/userStory";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Grip, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

type Props = {
  story: UserStory;
  isDragging?: boolean;
};

export function PrioritisedUserStoryCard({
  story,
  isDragging = false,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: story.id,
    data: {
      storyId: story.id,
      fromColumn: story.moscow,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} id={`us-${story.id}`} style={style}>
      <Card className="hover:shadow-md border border-border rounded-xl transition-all">
        <CardContent className="relative p-4 space-y-2 text-sm">
          <button
            type="button"
            {...listeners}
            {...attributes}
            className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing p-1 rounded-full bg-muted hover:bg-muted/70"
            style={{ touchAction: "none" }}
            aria-label={`Déplacer ${story.code ?? "la user story"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Grip className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex justify-between items-center pr-8">
            <p className="text-muted-foreground text-xs font-mono">
              {story.code}
            </p>
            <Link
              href={`/backlog?tab=user-stories#${story.id}`}
              className="text-muted-foreground hover:text-primary"
              scroll={false}
              onClick={(event) => event.stopPropagation()}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          </div>

          <h4 className="font-semibold">{story.title}</h4>
          <p className="text-muted-foreground line-clamp-3 text-sm italic">
            {story.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
