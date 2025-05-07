"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { EditTaskModal } from "./EditTaskModal";
import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useSprints } from "@/hooks/sprint/useSprints";
import { BacklogTask } from "@/lib/types/backlogTask";

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
  const { sprints } = useSprints();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<BacklogTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allTasks = [...todo, ...inProgress, ...inTesting, ...done];

  const findTask = (id: string) => allTasks.find((task) => task.id === id);

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

    const draggedTask = findTask(active.id as string);
    const newStatus = over?.data?.current?.columnId as BacklogTask["status"];

    if (draggedTask && draggedTask.status !== newStatus) {
      updateTaskStatus(draggedTask.id!, newStatus);
    }

    setActiveId(null);
  };

  const handleClickTask = (task: BacklogTask) => {
    setTaskToEdit(task);
  };

  const handleSaveEdit = (updatedTask: BacklogTask) => {
    if (updatedTask.id) {
      updateTask(updatedTask);
      setTaskToEdit(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
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
            column={{ id: "in-testing", title: "À Tester" }}
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
              {findTask(activeId) && (
                <KanbanItem task={findTask(activeId)!} sprints={sprints} />
              )}
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
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
}
