"use client";

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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { EditTaskModal } from "./EditTaskModal";
import { BacklogTask } from "@/lib/types/backlogTask";
import { useSprints } from "@/hooks/useSprints";

export function KanbanBoard() {
  const {
    todo,
    inProgress,
    inTesting,
    done,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useBacklogTasks();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<BacklogTask | null>(null);
  const { sprints } = useSprints();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTask = (status: BacklogTask["status"]) => {
    addTask({
      title: "Nouvelle tâche",
      description: "Description de la tâche",
      priority: "medium",
      storyPoints: 3,
      status,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const task = findTask(active.id as string);
    const newStatus = over?.data?.current?.columnId as BacklogTask["status"]; // Récupère la colonne cible

    if (task && task.status !== newStatus) {
      updateTaskStatus(task.id!, newStatus); // Met à jour le statut de la tâche
    }

    setActiveId(null);
  };

  const findTask = (taskId: string): BacklogTask | undefined => {
    const allTasks = [...todo, ...inProgress, ...inTesting, ...done];
    const task = allTasks.find((task) => task.id === taskId);

    return task;
  };

  const handleClickTask = (task: BacklogTask) => {
    setTaskToEdit(task);
  };

  const handleSaveEdit = (updated: BacklogTask) => {
    if (updated.id) {
      updateTask(updated);
      setTaskToEdit(null);
    }
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    setTaskToEdit(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
          <KanbanColumn
            column={{ id: "todo", title: "À Faire" }}
            tasks={todo}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "in-progress", title: "En Cours" }}
            tasks={inProgress}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "in-testing", title: "A tester" }}
            tasks={inTesting}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "done", title: "Terminé" }}
            tasks={done}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
        </div>
        <DragOverlay>
          {activeId && (
            <div className="w-[300px]">
              <KanbanItem task={findTask(activeId)!} sprints={sprints} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
