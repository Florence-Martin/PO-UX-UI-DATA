"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";

type Task = {
  id: string;
  title: string;
  priority: string;
  points: number;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "À Faire",
      tasks: [
        {
          id: "1",
          title: "Refonte page d'accueil",
          priority: "high",
          points: 8,
        },
        {
          id: "2",
          title: "Optimisation performances",
          priority: "medium",
          points: 5,
        },
      ],
    },
    {
      id: "inProgress",
      title: "En Cours",
      tasks: [
        {
          id: "3",
          title: "Tests A/B tunnel de conversion",
          priority: "high",
          points: 13,
        },
      ],
    },
    {
      id: "done",
      title: "Terminé",
      tasks: [
        {
          id: "4",
          title: "Analyse des besoins utilisateurs",
          priority: "high",
          points: 5,
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = findTask(active.id as string);
    const overColumn = columns.find(
      (col) =>
        col.id === over.id || col.tasks.some((task) => task.id === over.id)
    );

    if (!activeTask || !overColumn) return;

    setColumns((prevColumns) => {
      const oldColumn = prevColumns.find((col) =>
        col.tasks.some((task) => task.id === activeTask.id)
      );

      if (!oldColumn) return prevColumns;

      // Remove from old column
      const newOldColumn = {
        ...oldColumn,
        tasks: oldColumn.tasks.filter((task) => task.id !== activeTask.id),
      };

      // Add to new column
      const newOverColumn = {
        ...overColumn,
        tasks: [...overColumn.tasks, activeTask],
      };

      return prevColumns.map((col) => {
        if (col.id === oldColumn.id) return newOldColumn;
        if (col.id === overColumn.id) return newOverColumn;
        return col;
      });
    });

    setActiveId(null);
  };

  const findTask = (taskId: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-[600px]">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} tasks={column.tasks} />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="w-[300px]">
            <KanbanItem task={findTask(activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
