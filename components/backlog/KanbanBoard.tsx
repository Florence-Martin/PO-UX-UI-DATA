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
import { BacklogTask } from "@/lib/services/backlogTasksService";
import { EditTaskModal } from "./EditTaskModal";

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

    const newStatus = over.id as BacklogTask["status"];
    const task = findTask(active.id as string);
    if (task && task.status !== newStatus) {
      updateTaskStatus(task.id!, newStatus);
    }
    setActiveId(null);
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

  const findTask = (taskId: string): BacklogTask | undefined => {
    const allTasks = [...todo, ...inProgress, ...inTesting, ...done];
    return allTasks.find((task) => task.id === taskId);
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
          />
          <KanbanColumn
            column={{ id: "in-progress", title: "En Cours" }}
            tasks={inProgress}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
          />
          <KanbanColumn
            column={{ id: "in-testing", title: "A tester" }}
            tasks={inTesting}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
          />
          <KanbanColumn
            column={{ id: "done", title: "Terminé" }}
            tasks={done}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
          />
        </div>

        <DragOverlay>
          {activeId && (
            <div className="w-[300px]">
              <KanbanItem task={findTask(activeId)!} />
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
