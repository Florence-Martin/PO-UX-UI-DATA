"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BacklogTask } from "@/lib/services/backlogTasksService";
import { GripVertical } from "lucide-react"; // ou autre icône

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
  } = useSortable({ id: task.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="bg-background cursor-pointer hover:ring-2 ring-primary"
        onClick={() => {
          onClick?.(task);
        }}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-start">
            <div className="font-medium">{task.title}</div>
            {/* Zone de drag (handle seulement ici) */}
            <div {...attributes} {...listeners} className="cursor-grab">
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
        </CardContent>
      </Card>
    </div>
  );
}
