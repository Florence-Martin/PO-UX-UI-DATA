"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BacklogTask } from "@/lib/types/backlogTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Grip, Pin, PinOff, SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { UserStory } from "@/lib/types/userStory";

interface KanbanItemProps {
  task: BacklogTask;
  onClick?: (task: BacklogTask) => void;
}

export function KanbanItem({ task, onClick }: KanbanItemProps) {
  const [userStory, setUserStory] = useState<UserStory | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id!,
    data: {
      task,
      columnId: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  useEffect(() => {
    const fetchLinkedUserStory = async () => {
      const allUserStories = await getAllUserStories();
      const linkedStory = allUserStories.find(
        (story) => story.id === task.userStoryIds?.[0]
      );
      setUserStory(linkedStory || null);
    };

    if (task.userStoryIds?.length) {
      fetchLinkedUserStory();
    }
  }, [task.userStoryIds]);

  // Scroll automatique si l'URL contient le hash correspondant à cette tâche
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && hash === task.id && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current?.classList.add("ring-2", "ring-primary/60");

        // Nettoyage du style visuel après un moment
        setTimeout(() => {
          ref.current?.classList.remove("ring-2", "ring-primary/60");
        }, 3000);
      }, 150); // ⏳ Attente que le DOM soit prêt
    }
  }, [task.id]);

  return (
    <div
      ref={(el) => {
        setNodeRef(el); // Pour le drag and drop
        ref.current = el; // Pour le scroll
      }}
      id={task.id}
      style={style}
    >
      <Card
        className="relative bg-background hover:ring-2 ring-primary mr-1 cursor-pointer"
        onClick={() => {
          if (!isDragging) onClick?.(task);
        }}
      >
        <CardContent className="p-3 space-y-2 flex flex-col justify-between h-[170px]">
          {/* User Story liée */}
          {userStory ? (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-[11px] tracking-wide flex items-center gap-1">
                  <Pin className="w-3 h-3 text-red-500" />
                  <span>[{userStory.code}]</span>
                </span>
                <Link
                  href={`/backlog?tab=user-stories#${userStory.id}`}
                  title="Voir la User Story liée"
                  className="text-muted-foreground hover:text-primary"
                  rel="noopener noreferrer"
                  scroll={false}
                >
                  <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[12px] text-muted-foreground leading-snug line-clamp-2">
                {userStory.title}
              </p>
            </div>
          ) : (
            <div className="text-xs text-red-500 italic flex items-center gap-1 mb-2">
              <PinOff className="w-3 h-3" />
              Aucune User Story liée
            </div>
          )}

          {/* 🔤 Titre de la tâche */}
          <div className="flex justify-between items-start">
            <div className="font-medium text-xs">{task.title}</div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-1/2 right-[-15px] -translate-y-1/2 z-10">
                    <div
                      {...listeners}
                      {...attributes}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-grab active:cursor-grabbing p-1 rounded-full bg-muted hover:bg-muted/70 animate-pulse"
                    >
                      <Grip className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Glisser pour déplacer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* 🎯 Infos tâches */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                task.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.priority}
            </span>
            <span className="bg-muted px-2 py-1 rounded-full text-xs">
              {task.storyPoints} pts
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
