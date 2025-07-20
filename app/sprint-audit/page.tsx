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
      <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Chargement du sprint...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Audit {sprint.title} - Definition of Done
          </h1>
          <p className="text-muted-foreground">
            Validation des critères DoD avant clôture du sprint
          </p>
        </div>
        <Button
          onClick={handleSprintClosure}
          disabled={isClosing}
          className={
            incompleteStories.length === 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-orange-600 hover:bg-orange-700"
          }
        >
          {isClosing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Clôture en cours...
            </>
          ) : incompleteStories.length === 0 ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Clôturer {sprint.title}
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Clôturer et reporter {incompleteStories.length} US au backlog
            </>
          )}
        </Button>
      </div>

      {/* Métriques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progression DoD
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallProgress.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overallProgress.completed}/{overallProgress.total} critères
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Stories</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprintStories.length}</div>
            <p className="text-xs text-muted-foreground">À auditer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prêtes à clôturer
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {readyStories.length}
            </div>
            <p className="text-xs text-muted-foreground">100% DoD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À compléter</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {incompleteStories.length}
            </div>
            <p className="text-xs text-muted-foreground">DoD incomplète</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des User Stories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          User Stories du {sprint.title}
        </h2>

        {sprintStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  [{story.code}] {story.title}
                </CardTitle>
                <UserStoryDoDSummary dodProgress={story.dodProgress} />
              </div>
            </CardHeader>
            <CardContent>
              <UserStoryDoD
                dodProgress={story.dodProgress}
                onUpdate={(progress) => handleDoDUpdate(story.id, progress)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {sprintStories.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
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
        <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
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
