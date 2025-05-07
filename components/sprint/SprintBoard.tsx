"use client";

import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useUserStories } from "@/hooks/useUserStories";
import { SprintActiveCard } from "./SprintActiveCard";
import { useActiveSprint } from "@/hooks/sprint/useActiveSprint";
import {
  CircleDashed,
  LoaderCircle,
  FlaskConical,
  CheckCircle2,
  Info,
  Wrench,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const columns = [
  {
    label: "À faire",
    status: "todo",
    icon: <CircleDashed className="w-4 h-4" />,
    description: "Tâches prêtes à démarrer",
  },
  {
    label: "En cours",
    status: "in-progress",
    icon: <LoaderCircle className="w-4 h-4 animate-spin-slow" />,
    description: "Tâches en cours de développement",
  },
  {
    label: "A tester",
    status: "in-testing",
    icon: <FlaskConical className="w-4 h-4" />,
    description: "Tâches à valider ou à tester",
  },
  {
    label: "Terminé",
    status: "done",
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: "Tâches terminées et validées",
  },
];

export function SprintBoard() {
  const { tasks } = useBacklogTasks();
  const { userStories } = useUserStories();
  const { activeSprint } = useActiveSprint();

  if (!activeSprint) {
    return <p className="text-sm text-muted-foreground">Aucun sprint actif</p>;
  }

  const sprintUserStoryIds = activeSprint.userStoryIds ?? [];

  const sprintTasks = tasks.filter((task) =>
    task.userStoryIds?.some((id) => sprintUserStoryIds.includes(id))
  );

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
    <div className="space-y-6">
      <SprintActiveCard sprint={activeSprint} userStories={userStories} />

      <div>
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

      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const tasksForColumn = sprintTasks.filter(
              (t) => t.status === col.status
            );

            return (
              <div
                key={col.label}
                className="bg-muted p-4 rounded-xl shadow-sm w-full flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  {col.icon}
                  <h3 className="text-lg font-semibold truncate">
                    {col.label}
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{col.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-2 overflow-hidden">
                  {tasksForColumn.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune tâche
                    </p>
                  ) : (
                    tasksForColumn.map((task) => {
                      const userStory = userStories.find((us) =>
                        task.userStoryIds?.includes(us.id!)
                      );

                      return (
                        <div
                          key={task.id}
                          className="p-4 rounded-lg bg-background border space-y-3 min-h-[140px] hover:shadow-md transition-all"
                        >
                          {/* Ligne : code US + icône de lien */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-mono truncate">
                              {userStory?.code ?? "US-???"}
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/backlog?tab=kanban#${task.id}`}
                                  scroll={false}
                                >
                                  <Wrench className="w-4 h-4 hover:text-primary transition-colors" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                Modifier dans le backlog
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          {/* Titre avec 2 lignes et élargissement */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h4 className="font-medium text-sm leading-snug line-clamp-2 cursor-default">
                                {task.title}
                              </h4>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs md:max-w-sm whitespace-pre-wrap">
                              {task.title}
                            </TooltipContent>
                          </Tooltip>

                          {/* Ligne points */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Story Points : {task.storyPoints}</span>
                            {/* Optionnel : badge de priorité, si disponible */}
                            {/* <Badge variant="outline" className="text-[10px]">Medium</Badge> */}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
