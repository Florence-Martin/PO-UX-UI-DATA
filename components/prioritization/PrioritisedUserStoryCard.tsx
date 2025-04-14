"use client";

import { useEffect, useRef } from "react";
import { UserStory } from "@/lib/types/userStory";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCombinedRefs } from "@/hooks/useCombinedRefs";
import { SquareArrowOutUpRight } from "lucide-react";

type Props = {
  story: UserStory;
};

export function PrioritisedUserStoryCard({ story }: Props) {
  // DnD avec id = story.id
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: story.id!,
    data: { story, columnId: story.moscow },
  });

  const localRef = useRef<HTMLDivElement>(null);
  const combinedRef = useCombinedRefs<HTMLDivElement>(localRef, setNodeRef);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={combinedRef}
      id={`us-${story.id}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card className="hover:shadow-md border border-border rounded-xl transition-all">
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-xs font-mono">
              {story.code}
            </p>
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
