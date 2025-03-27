"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanItem } from "./KanbanItem";
import { BacklogTask } from "@/lib/types/backlogTask";

interface KanbanColumnProps {
  column: {
    id: BacklogTask["status"];
    title: string;
  };
  tasks: BacklogTask[];
  onAddTask: (status: BacklogTask["status"]) => void;
  onTaskClick?: (task: BacklogTask) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col md:w-80 bg-muted rounded-lg p-2"
    >
      <div className="flex items-center justify-between p-2">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-muted-foreground text-sm">
          {tasks.length} tâche{tasks.length > 1 ? "s" : ""}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <SortableContext
          id={column.id}
          items={tasks.map((task) => task.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 p-2">
            {tasks.map((task) => (
              <KanbanItem
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>

      <Button
        variant="ghost"
        className="w-full mt-2"
        onClick={() => onAddTask(column.id)}
      >
        <Plus className="h-4 w-4 mr-2" /> Ajouter une tâche
      </Button>
    </div>
  );
}
