"use client";

import { useEffect, useRef } from "react";
import { UserStory } from "@/lib/types/userStory";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCombinedRefs } from "@/hooks/useCombinedRefs";

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
    id: story.id!, // ✅ fix: use story.id, not task.id
    data: {
      story,
    },
  });

  const localRef = useRef<HTMLDivElement>(null);
  const combinedRef = useCombinedRefs<HTMLDivElement>(localRef, setNodeRef);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  // Gestion du scroll vers l'élément si le hash correspond
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === `us-${story.id}` && localRef.current) {
      setTimeout(() => {
        localRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        localRef.current?.classList.add("highlight-ring");
        setTimeout(() => {
          localRef.current?.classList.remove("highlight-ring");
        }, 3000);
      }, 150);
    }
  }, [story.id]);

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
          <p className="text-muted-foreground text-xs font-mono">
            {story.code}
          </p>
          <h4 className="font-semibold">{story.title}</h4>
          <p className="text-muted-foreground line-clamp-3 text-sm italic">
            {story.description}
          </p>
          <Link
            href={`/backlog?tab=user-stories#us-${story.id}`}
            className="text-blue-500 hover:underline text-xs"
          >
            Modifier
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
