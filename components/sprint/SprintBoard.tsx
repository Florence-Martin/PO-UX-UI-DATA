"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveSprints } from "@/hooks/sprint/useActiveSprints";
import { useBacklogTasks } from "@/hooks/useBacklogTasks";
import { useUserStories } from "@/hooks/useUserStories";
import { updateSprint } from "@/lib/services/sprintService";
import { UserStory } from "@/lib/types/userStory";
import {
  CheckCircle2,
  CircleDashed,
  FlaskConical,
  Info,
  LoaderCircle,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { UserStoryDoDFlexibleSummary } from "../user-story/UserStoryDoD";
import { SprintActiveCard } from "./SprintActiveCard";

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
  const { activeSprints, selectedSprint, setSelectedSprint } =
    useActiveSprints();
  const router = useRouter();

  // Utiliser le sprint sélectionné ou le premier sprint actif
  const activeSprint = selectedSprint || activeSprints[0] || null;

  const handleNavigateToBacklog = (taskId: string) => {
    router.push(`/sprint?tab=kanban#${taskId}`);
  };

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

  // ✅ Récupérer les User Stories du sprint actif
  // Source de vérité : sprintId (soit via activeSprint.userStoryIds, soit via us.sprintId)
  // Le badge n'est plus utilisé comme critère de filtrage
  // NOTE : Cette logique est équivalente à getUserStoriesForSprint(activeSprint, userStories)
  // Nous utilisons ici le filtrage manuel pour des raisons de performance (pas besoin d'importer la fonction)
  const sprintUserStories = userStories.filter((us) =>
    sprintUserStoryIds.includes(us.id)
  );

  // ✅ Filtrer les tâches du sprint actif
  // Une tâche appartient au sprint si elle référence au moins une User Story du sprint
  // Source de vérité : task.userStoryIds intersecte les US du sprint actif
  // Le badge n'est plus utilisé comme critère de filtrage
  // NOTE : Cette logique est équivalente à getTasksForSprint(tasks, sprintUserStoryIds)
  // Nous utilisons ici le filtrage manuel pour des raisons de performance (pas besoin d'importer la fonction)
  const sprintTasks = tasks.filter((task) =>
    task.userStoryIds?.some((id) => sprintUserStoryIds.includes(id))
  );

  // ✅ Plus besoin de tâches virtuelles : nous créons maintenant des vraies tâches automatiquement !
  // Utiliser directement les tâches réelles du sprint
  const allSprintTasks = sprintTasks;

  // Vérifier si une User Story a sa DoD complétée
  const isUserStoryDoDCompleted = (userStory: UserStory): boolean => {
    if (!userStory.dodItems || userStory.dodItems.length === 0) return false;
    return userStory.dodItems.every((item) => item.checked);
  };

  // Vérifier si toutes les User Stories du sprint ont leur DoD validée
  const allUserStoriesHaveDoDCompleted =
    sprintUserStories.length > 0 &&
    sprintUserStories.every(isUserStoryDoDCompleted);

  // 🆕 Calcul de la progression DoD globale du sprint
  const totalDoDCriteria = sprintUserStories.reduce(
    (sum, us) => sum + (us.dodItems?.length || 0),
    0
  );

  const completedDoDCriteria = sprintUserStories.reduce((sum, us) => {
    if (!us.dodItems) return sum;
    return sum + us.dodItems.filter((item) => item.checked).length;
  }, 0);

  const dodProgressPercent =
    totalDoDCriteria > 0
      ? Math.round((completedDoDCriteria / totalDoDCriteria) * 100)
      : 0;

  // Un sprint est terminé si toutes les tâches sont done ET que toutes les US ont leur DoD validée
  const isSprintDone =
    allSprintTasks.length > 0 &&
    allSprintTasks.every((task) => task.status === "done") &&
    allUserStoriesHaveDoDCompleted;

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
      {/* 🆕 Sélecteur de sprint actif */}
      {activeSprints.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Sprint affiché :</span>
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

      <SprintActiveCard sprint={activeSprint} userStories={userStories} />

      {/* 🆕 Barre de progression DoD globale du sprint */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Definition of Done : {completedDoDCriteria} / {totalDoDCriteria}{" "}
          critères validés ({dodProgressPercent}%)
        </p>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              dodProgressPercent === 100
                ? "bg-green-500"
                : dodProgressPercent >= 70
                  ? "bg-yellow-500"
                  : dodProgressPercent >= 40
                    ? "bg-orange-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${dodProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Indicateur DoD des User Stories */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Definition of Done (DoD)</p>
          <span
            className={`text-xs px-2 py-1 rounded ${
              allUserStoriesHaveDoDCompleted
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {sprintUserStories.filter(isUserStoryDoDCompleted).length} /{" "}
            {sprintUserStories.length} validées
          </span>
        </div>
        <div className="space-y-2">
          {sprintUserStories.map((us) => (
            <div
              key={us.id}
              className="flex items-center justify-between text-xs gap-2"
            >
              <span className="font-mono flex-shrink-0">{us.code}</span>
              <div className="flex-1">
                <UserStoryDoDFlexibleSummary dodItems={us.dodItems} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6 w-full">
        {/* Bouton d'audit DoD à gauche */}
        <div className="flex items-center gap-2">
          <Link href={`/sprint-audit?sprintId=${activeSprint.id}`}>
            <Button variant="outline" size="sm" className="text-sm">
              📋 Audit DoD
            </Button>
          </Link>
        </div>

        {/* Contrôles Review et Retrospective à droite */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
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
                    Toutes les tâches doivent être terminées ET toutes les User
                    Stories doivent avoir leur DoD validée pour effectuer la
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
                    La Review doit être validée avant de cocher la
                    Rétrospective.
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
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const tasksForColumn = allSprintTasks.filter(
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
                          className="p-4 rounded-lg border space-y-3 min-h-[140px] transition-all bg-background hover:shadow-md"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono truncate font-medium">
                              {userStory?.code ?? "US-???"}
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() =>
                                    handleNavigateToBacklog(task.id!)
                                  }
                                  className="inline-flex items-center justify-center p-1 rounded hover:bg-accent transition-colors cursor-pointer"
                                >
                                  <Wrench className="w-4 h-4 hover:text-primary transition-colors" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Modifier dans le Sprint Backlog
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
