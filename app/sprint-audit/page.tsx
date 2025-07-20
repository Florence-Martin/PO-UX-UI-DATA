"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserStoryDoD,
  UserStoryDoDSummary,
} from "@/components/user-story/UserStoryDoD";
import { useUserStories } from "@/hooks/useUserStories";
import {
  closeSprint,
  getSprintById,
  handleIncompleteUserStories,
} from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { DoDProgress, UserStory } from "@/lib/types/userStory";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function SprintAuditContent() {
  const { userStories, updateDoDProgress, loading } = useUserStories();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [sprintStories, setSprintStories] = useState<UserStory[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sprintId = searchParams.get("sprintId");

  useEffect(() => {
    const loadSprint = async () => {
      if (!sprintId) {
        toast.error("ID du sprint manquant");
        router.push("/sprint");
        return;
      }

      try {
        const sprintData = await getSprintById(sprintId);

        if (sprintData) {
          setSprint(sprintData);

          // Filtrer les US du sprint
          const stories = userStories.filter(
            (story) =>
              sprintData.userStoryIds?.includes(story.id) ||
              story.sprintId === sprintData.id
          );
          setSprintStories(stories);
        } else {
          toast.error("Sprint non trouvé");
          router.push("/sprint");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du sprint:", error);
        toast.error("Erreur lors du chargement du sprint");
        router.push("/sprint");
      }
    };

    if (userStories.length > 0 && sprintId) {
      loadSprint();
    }
  }, [userStories, sprintId, router]);

  const calculateOverallProgress = () => {
    if (sprintStories.length === 0)
      return { completed: 0, total: 0, percentage: 0 };

    const totalCriteria = sprintStories.length * 6; // 6 critères par US
    const completedCriteria = sprintStories.reduce((acc, story) => {
      if (!story.dodProgress) return acc;
      return acc + Object.values(story.dodProgress).filter(Boolean).length;
    }, 0);

    return {
      completed: completedCriteria,
      total: totalCriteria,
      percentage:
        totalCriteria > 0
          ? Math.round((completedCriteria / totalCriteria) * 100)
          : 0,
    };
  };

  const getReadyForClosureStories = () => {
    return sprintStories.filter((story) => {
      if (!story.dodProgress) return false;
      return Object.values(story.dodProgress).every(Boolean);
    });
  };

  const getIncompleteStories = () => {
    return sprintStories.filter((story) => {
      if (!story.dodProgress) return true;
      return !Object.values(story.dodProgress).every(Boolean);
    });
  };

  const handleDoDUpdate = async (storyId: string, newProgress: DoDProgress) => {
    await updateDoDProgress(storyId, newProgress);

    // Mettre à jour l'état local
    setSprintStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, dodProgress: newProgress } : story
      )
    );
  };

  const handleSprintClosure = async () => {
    const readyStories = getReadyForClosureStories();
    const incompleteStories = getIncompleteStories();

    if (!sprint?.id) {
      toast.error("Erreur : Sprint non trouvé");
      return;
    }

    try {
      setIsClosing(true);

      // Si il y a des US non terminées, les reporter au backlog
      if (incompleteStories.length > 0) {
        const usResult = await handleIncompleteUserStories(
          sprint.id,
          sprintStories,
          "backlog"
        );

        toast.info(
          `${usResult.moved} User Stories non terminées reportées au backlog`
        );
      }

      // Clôturer le sprint
      await closeSprint(sprint.id);

      toast.success(
        `${sprint.title} clôturé avec succès ! ${readyStories.length} User Stories conformes DoD, ${incompleteStories.length} reportées au backlog.`
      );

      // Rediriger vers la page des sprints après un petit délai
      setTimeout(() => {
        router.push("/sprint");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la clôture:", error);
      toast.error("Erreur lors de la clôture du sprint");
    } finally {
      setIsClosing(false);
    }
  };

  const overallProgress = calculateOverallProgress();
  const readyStories = getReadyForClosureStories();
  const incompleteStories = getIncompleteStories();

  if (!sprint) {
    return (
      <div className="flex-1 space-y-4 px-2 sm:px-4 lg:px-8 pt-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              Chargement du sprint...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-4 lg:px-8 pt-4 pb-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Audit {sprint.title} - Definition of Done
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Validation des critères DoD avant clôture du sprint
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={handleSprintClosure}
            disabled={isClosing}
            size="sm"
            className={`w-full sm:w-auto text-sm ${
              incompleteStories.length === 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isClosing ? (
              <>
                <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="hidden sm:inline">Clôture en cours...</span>
                <span className="sm:hidden">Clôture...</span>
              </>
            ) : incompleteStories.length === 0 ? (
              <>
                <CheckCircle2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  Clôturer {sprint.title}
                </span>
                <span className="sm:hidden">Clôturer</span>
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">
                  Clôturer et reporter {incompleteStories.length} US au backlog
                </span>
                <span className="lg:hidden">
                  Clôturer ({incompleteStories.length} US au backlog)
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Progression DoD
            </CardTitle>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {overallProgress.percentage}%
            </div>
            <p className="text-xs text-muted-foreground leading-tight">
              {overallProgress.completed}/{overallProgress.total} critères
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              User Stories
            </CardTitle>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {sprintStories.length}
            </div>
            <p className="text-xs text-muted-foreground">À auditer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Prêtes à clôturer
            </CardTitle>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {readyStories.length}
            </div>
            <p className="text-xs text-muted-foreground">100% DoD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              À compléter
            </CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {incompleteStories.length}
            </div>
            <p className="text-xs text-muted-foreground">DoD incomplète</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des User Stories */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          User Stories du {sprint.title}
        </h2>

        {sprintStories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg leading-tight break-words">
                    [{story.code}] {story.title}
                  </CardTitle>
                  {story.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {story.description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <UserStoryDoDSummary dodProgress={story.dodProgress} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <UserStoryDoD
                  dodProgress={story.dodProgress}
                  onUpdate={(progress) => handleDoDUpdate(story.id, progress)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sprintStories.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              Aucune User Story trouvée pour ce sprint.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SprintAuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 space-y-4 px-2 sm:px-4 lg:px-8 pt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground text-sm sm:text-base">
                Chargement de l&apos;audit...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SprintAuditContent />
    </Suspense>
  );
}
