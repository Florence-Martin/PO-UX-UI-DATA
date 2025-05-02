"use client";

import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useSprints } from "@/hooks/useSprints"; // assure-toi que le nom du fichier est bien useSprints.ts
import { BacklogTask } from "@/lib/types/backlogTask";

const columns = ["À faire", "En cours", "A tester", "Terminé"];

const statusMap: Record<string, BacklogTask["status"]> = {
  "À faire": "todo",
  "En cours": "in-progress",
  "A tester": "in-testing",
  Terminé: "done",
};

export function SprintBoard() {
  const { tasks } = useBacklogTasks();
  const { currentSprint } = useSprints();

  if (!currentSprint) {
    return <p className="text-sm text-muted-foreground">Aucun sprint actif</p>;
  }

  // const sprintTasks = tasks.filter((task) => task.id === currentSprint.id);
  const sprintUserStoryIds = currentSprint?.userStoryIds ?? [];

  const sprintTasks = tasks.filter((task) =>
    task.userStoryIds?.some((id) => sprintUserStoryIds.includes(id))
  );

  // Calcul de la progression du sprint
  const totalPoints = sprintTasks.reduce(
    (sum, task) => sum + (task.storyPoints || 0),
    0
  );
  const donePoints = sprintTasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  const percentDone =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Indicateur de progression */}
        <div className="mt-2 mb-4">
          <p className="text-sm text-muted-foreground mb-1">
            Progression : {donePoints} / {totalPoints} pts ({percentDone}%)
          </p>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold">
          Sprint en cours : {currentSprint.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Du{" "}
          {new Date(
            currentSprint.startDate?.toDate?.() ?? currentSprint.startDate
          ).toLocaleDateString()}{" "}
          au{" "}
          {new Date(
            currentSprint.endDate?.toDate?.() ?? currentSprint.endDate
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const status = statusMap[col];
          const tasksForColumn = sprintTasks.filter((t) => t.status === status);

          return (
            <div key={col} className="bg-muted p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{col}</h3>
              <div className="space-y-2">
                {tasksForColumn.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune tâche</p>
                ) : (
                  tasksForColumn.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-background border"
                    >
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Story Points : {task.storyPoints}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
