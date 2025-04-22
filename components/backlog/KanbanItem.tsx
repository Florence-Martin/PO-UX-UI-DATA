"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BacklogTask } from "@/lib/types/backlogTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCombinedRefs } from "@/hooks/useCombinedRefs";
import { toast } from "sonner";

import {
  Grip,
  MoreVertical,
  Pin,
  PinOff,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  updateUserStory,
  getAllUserStories,
} from "@/lib/services/userStoryService";
import { UserStory } from "@/lib/types/userStory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sprint } from "@/lib/types/sprint";
import { getSprintById, updateSprint } from "@/lib/services/sprintService";

interface KanbanItemProps {
  task: BacklogTask;
  sprints: Sprint[];
  onClick?: (task: BacklogTask) => void;
}

export function KanbanItem({ task, onClick, sprints }: KanbanItemProps) {
  const [userStory, setUserStory] = useState<UserStory | null>(null);

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
  const localRef = useRef<HTMLDivElement>(null);
  const combinedRef = useCombinedRefs<HTMLDivElement>(localRef, setNodeRef);

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

  const handleAssignToSprint = async (task: BacklogTask, sprintId: string) => {
    const userStoryId = task.userStoryIds?.[0];
    if (!userStoryId) {
      toast.error("Impossible d’assigner la User Story au sprint.");
      return;
    }

    try {
      // 🔁 1. Mettre à jour le champ sprintId dans la User Story
      await updateUserStory(userStoryId, { sprintId });

      // ✅ 2. Mettre à jour le champ userStoryIds du Sprint
      const sprint = await getSprintById(sprintId);
      const updatedIds = sprint?.userStoryIds || [];

      if (!updatedIds.includes(userStoryId)) {
        await updateSprint(sprintId, {
          userStoryIds: [...updatedIds, userStoryId],
        });
      }

      toast.success("US ajoutée au sprint !");
    } catch (err) {
      toast.error("Erreur lors de l’ajout de l'US au sprint.");
      console.error(err);
    }
  };

  // Scroll automatique si l'URL contient le hash correspondant à cette tâche
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === task.id && localRef.current) {
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
  }, [task.id]);

  return (
    <div ref={combinedRef} id={task.id} style={style}>
      <Card
        className="relative bg-background hover:ring-2 ring-primary/40 mr-1 cursor-pointer"
        onClick={() => {
          if (!isDragging) onClick?.(task);
        }}
      >
        <CardContent className="p-3 space-y-2 flex flex-col justify-between h-[170px]">
          {/* User Story liée */}
          {userStory ? (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between items-start">
                {/* Code + lien */}
                <div className="flex space-x-1 items-center gap-1">
                  <Pin className="w-3 h-3 text-red-500" />
                  <span className="font-medium text-[11px] tracking-wide">
                    [{userStory.code}]
                  </span>
                  <Link
                    href={`/backlog?tab=user-stories#${userStory.id}`}
                    title="Voir la User Story liée"
                    className="text-muted-foreground hover:text-primary"
                    scroll={false}
                  >
                    <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {/* Pastille du Sprint */}
                  {userStory?.sprintId && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Sprint {userStory.sprintId.split("-")[1]}
                    </span>
                  )}
                </div>

                {/* Dropdown d’assignation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assigner au Sprint</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(sprints ?? []).map((sprint) => (
                      <DropdownMenuItem
                        key={sprint.id}
                        onClick={() => handleAssignToSprint(task, sprint.id)}
                      >
                        {sprint.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Titre de l’US */}
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
