"use client";

import { useTimeline } from "@/context/TimelineContext";
import { useSprints } from "@/hooks/sprint";
import { useActiveSprints } from "@/hooks/sprint/useActiveSprints";
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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { EditTaskModal } from "./EditTaskModal";
import { KanbanColumn } from "./KanbanColumn";

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
  const { activeSprints, selectedSprint, setSelectedSprint } =
    useActiveSprints();
  const { userStories } = useUserStories();

  const [taskToEdit, setTaskToEdit] = useState<BacklogTask | null>(null);
  const { refreshOnDemand } = useTimeline();

  // Utiliser le sprint sélectionné ou le premier sprint actif
  const activeSprint = selectedSprint || activeSprints[0] || null;

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const draggedTask = sprintTasks.find((task) => task.id === active.id);
    const targetStatus = over?.data?.current?.columnId as
      | BacklogTask["status"]
      | undefined;

    // Le backlog supporte uniquement le déplacement inter-colonnes.
    // Aucun ordre intra-colonne n'est persisté aujourd'hui.
    if (!draggedTask || !targetStatus || draggedTask.status === targetStatus) {
      return;
    }

    await updateTaskStatus(draggedTask.id!, targetStatus);
    await refreshOnDemand(); // synchronisation du contexte Timeline
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
      {/* 🆕 Sélecteur de sprint actif */}
      {activeSprints.length > 1 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-medium">Sprint actif :</span>
          <select
            value={selectedSprint?.id || ""}
            onChange={(e) => {
              const sprint = activeSprints.find((s) => s.id === e.target.value);
              setSelectedSprint(sprint || null);
            }}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            {activeSprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            ({activeSprints.length} sprint{activeSprints.length > 1 ? "s" : ""}{" "}
            en cours)
          </span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
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
