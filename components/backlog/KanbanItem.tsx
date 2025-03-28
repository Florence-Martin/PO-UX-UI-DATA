"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BacklogTask } from "@/lib/types/backlogTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface KanbanItemProps {
  task: BacklogTask;
  onClick?: (task: BacklogTask) => void;
}

export function KanbanItem({ task, onClick }: KanbanItemProps) {
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
      columnId: task.status, // ✅ très important pour DnD
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="bg-background hover:ring-2 ring-primary mr-1"
        onClick={() => {
          if (!isDragging) onClick?.(task); // Empêche l'ouverture de la modal pendant le click
        }}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-start">
            <div className="font-medium">{task.title}</div>

            {/* Handle de drag */}
            <div
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 opacity-50" />
            </div>
          </div>

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
          {Array.isArray(task.userStoryIds) && task.userStoryIds.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              📌 {task.userStoryIds.length} user stor
              {task.userStoryIds.length > 1 ? "ies" : "y"} liée
              {task.userStoryIds.length > 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
