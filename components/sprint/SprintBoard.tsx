"use client";

import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useUserStories } from "@/hooks/useUserStories";
import { SprintActiveCard } from "./SprintActiveCard";
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
import { useActiveSprint } from "@/hooks/sprint";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSprint } from "@/lib/services/sprintService";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

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
    return (
      <p className="text-sm text-muted-foreground">
        Aucun sprint actif...
        <br />
        <span className="text-base text-orange-500 text-muted-foreground animate-pulse">
          ne perdons pas de vue notre Sprint Goal !
        </span>
      </p>
    );
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

  const isSprintDone =
    sprintTasks.length > 0 &&
    sprintTasks.every((task) => task.status === "done");

  const handleCloseSprint = async () => {
    if (!activeSprint) return;

    try {
      await updateSprint(activeSprint.id, {
        status: "done",
        hasReview: true,
        hasRetrospective: true,
        closedAt: new Date(),
      });

      toast.success("\u{1F389} Sprint clôturé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la clôture du sprint", error);
      toast.error("Erreur lors de la clôture du sprint.");
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-6 w-full">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Checkbox
                    id="review"
                    checked={activeSprint.hasReview}
                    disabled={!isSprintDone}
                    onCheckedChange={async (checked) => {
                      await updateSprint(activeSprint.id, {
                        hasReview: !!checked,
                      });
                      toast.success("Sprint Review effectuée!");
                    }}
                  />
                </span>
              </TooltipTrigger>
              {!isSprintDone && (
                <TooltipContent>
                  Toutes les tâches doivent être terminées pour valider la
                  Review.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Label htmlFor="review" className="text-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Sprint Review effectuée
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Checkbox
                    id="retrospective"
                    checked={activeSprint.hasRetrospective}
                    disabled={!activeSprint.hasReview}
                    onCheckedChange={async (checked) => {
                      await updateSprint(activeSprint.id, {
                        hasRetrospective: !!checked,
                        // Si cochée, on passe le sprint en "done" et on ajoute la date de clôture
                        ...(checked
                          ? { status: "done", closedAt: new Date() }
                          : {}),
                      });
                      toast.success("Sprint Rétrospective effectuée!");
                    }}
                  />
                </span>
              </TooltipTrigger>
              {!activeSprint.hasReview && (
                <TooltipContent>
                  La Review doit être validée avant de cocher la Rétrospective.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Label
            htmlFor="retrospective"
            className="text-sm flex items-center gap-1"
          >
            <LoaderCircle className="w-4 h-4 text-blue-500" />
            Rétrospective complétée
          </Label>
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

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Story Points : {task.storyPoints}</span>
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
      {isSprintDone && (
        <div className="text-right mt-4">
          <Button onClick={handleCloseSprint} variant="default">
            ✅ Clôturer le sprint
          </Button>
        </div>
      )}
    </div>
  );
}
