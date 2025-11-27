"use client";

import { useTimeline } from "@/context/TimelineContext";
import { useActiveSprint, useSprints } from "@/hooks/sprint";
import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useUserStories } from "@/hooks/useUserStories";
import { BacklogTask } from "@/lib/types/backlogTask";
import {
  getTasksForSprint,
  getUserStoriesForSprint,
} from "@/lib/utils/sprintUserStories";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { EditTaskModal } from "./EditTaskModal";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";

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
  const { activeSprint } = useActiveSprint();
  const { userStories } = useUserStories();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<BacklogTask | null>(null);
  const { refreshOnDemand } = useTimeline();

  // ✅ Récupérer les User Stories du sprint actif
  // Utilise la fonction centralisée qui gère la double source de vérité (push/pull)
  const sprintUserStories = getUserStoriesForSprint(activeSprint, userStories);
  const sprintUserStoryIds = sprintUserStories.map((us) => us.id);

  // ✅ Filtrer les tâches du sprint actif
  // Une tâche appartient au sprint si elle référence au moins une US du sprint
  // Source de vérité : task.userStoryIds intersecte les US du sprint
  // Le badge n'est PLUS utilisé comme critère de filtrage
  const allTasksFromHook = [...todo, ...inProgress, ...inTesting, ...done];
  const sprintTasks = getTasksForSprint(allTasksFromHook, sprintUserStoryIds);

  // Répartir les tâches du sprint par statut
  const sprintTodo = sprintTasks.filter((t) => t.status === "todo");
  const sprintInProgress = sprintTasks.filter(
    (t) => t.status === "in-progress"
  );
  const sprintInTesting = sprintTasks.filter((t) => t.status === "in-testing");
  const sprintDone = sprintTasks.filter((t) => t.status === "done");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTask = (id: string) => sprintTasks.find((task) => task.id === id);

  const handleAddTask = (status: BacklogTask["status"]) => {
    // ✅ Lier la nouvelle tâche aux User Stories du sprint actif
    // Sans userStoryIds, la tâche serait filtrée par getTasksForSprint()
    const userStoryIds =
      sprintUserStoryIds.length > 0 ? sprintUserStoryIds : [];

    addTask({
      title: "Nouvelle tâche",
      description: "Description de la tâche",
      priority: "medium",
      storyPoints: 3,
      status,
      userStoryIds, // ✅ CRITIQUE : Permet de lier la tâche au sprint
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const draggedTask = findTask(active.id as string);
    console.debug("[DEBUG] draggedTask:", draggedTask);
    const newStatus = over?.data?.current?.columnId as BacklogTask["status"];

    if (draggedTask && draggedTask.status !== newStatus) {
      await updateTaskStatus(draggedTask.id!, newStatus);
      await refreshOnDemand(); // synchronisation du contexte Timeline
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
            tasks={sprintTodo}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "in-progress", title: "En Cours" }}
            tasks={sprintInProgress}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "in-testing", title: "À Tester" }}
            tasks={sprintInTesting}
            onAddTask={handleAddTask}
            onTaskClick={handleClickTask}
            sprints={sprints}
          />
          <KanbanColumn
            column={{ id: "done", title: "Terminé" }}
            tasks={sprintDone}
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
          activeSprint={activeSprint}
          sprintUserStories={sprintUserStories}
        />
      )}
    </>
  );
}
