"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserStoryDoD,
  UserStoryDoDSummary,
} from "@/components/user-story/UserStoryDoD";
import { useUserStories } from "@/hooks/useUserStories";
import { closeSprint, getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { DoDProgress, UserStory } from "@/lib/types/userStory";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Sprint24AuditPage() {
  const { userStories, updateDoDProgress, loading } = useUserStories();
  const [sprint24, setSprint24] = useState<Sprint | null>(null);
  const [sprint24Stories, setSprint24Stories] = useState<UserStory[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadSprint24 = async () => {
      try {
        const sprints = await getAllSprints();
        const sprint = sprints.find(
          (s) => s.title?.includes("Sprint 24") || s.title?.includes("24")
        );

        if (sprint) {
          setSprint24(sprint);

          // Filtrer les US du Sprint 24
          const sprintStories = userStories.filter(
            (story) =>
              sprint.userStoryIds?.includes(story.id) ||
              story.sprintId === sprint.id
          );
          setSprint24Stories(sprintStories);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du Sprint 24:", error);
      }
    };

    if (userStories.length > 0) {
      loadSprint24();
    }
  }, [userStories]);

  const calculateOverallProgress = () => {
    if (sprint24Stories.length === 0)
      return { completed: 0, total: 0, percentage: 0 };

    const totalCriteria = sprint24Stories.length * 6; // 6 critères par US
    const completedCriteria = sprint24Stories.reduce((acc, story) => {
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
    return sprint24Stories.filter((story) => {
      if (!story.dodProgress) return false;
      return Object.values(story.dodProgress).every(Boolean);
    });
  };

  const getIncompleteStories = () => {
    return sprint24Stories.filter((story) => {
      if (!story.dodProgress) return true;
      return !Object.values(story.dodProgress).every(Boolean);
    });
  };

  const handleDoDUpdate = async (storyId: string, newProgress: DoDProgress) => {
    await updateDoDProgress(storyId, newProgress);

    // Mettre à jour l'état local
    setSprint24Stories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, dodProgress: newProgress } : story
      )
    );
  };

  const handleSprintClosure = async () => {
    const readyStories = getReadyForClosureStories();
    const incompleteStories = getIncompleteStories();

    if (incompleteStories.length > 0) {
      toast.error(
        `${incompleteStories.length} User Stories ne respectent pas 100% de la DoD. Veuillez les compléter ou les reporter au Sprint 25.`
      );
      return;
    }

    if (!sprint24?.id) {
      toast.error("Erreur : Sprint 24 non trouvé");
      return;
    }

    try {
      setIsClosing(true);

      // Clôturer le sprint
      await closeSprint(sprint24.id);

      toast.success(
        `Sprint 24 clôturé avec succès ! ${readyStories.length} User Stories conformes DoD.`
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

  if (!sprint24) {
    return (
      <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Sprint 24 non trouvé. Assurez-vous qu&apos;il existe dans votre
              système.
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
            Audit Sprint 24 - Definition of Done
          </h1>
          <p className="text-muted-foreground">
            Validation des critères DoD avant clôture du sprint
          </p>
        </div>
        <Button
          onClick={handleSprintClosure}
          disabled={incompleteStories.length > 0 || isClosing}
          className={
            incompleteStories.length === 0
              ? "bg-green-600 hover:bg-green-700"
              : ""
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
              Clôturer Sprint 24
            </>
          ) : (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Sprint pas prêt
            </>
          )}
        </Button>
      </div>

      {/* Métriques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progression Globale
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">US Conformes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {readyStories.length}
            </div>
            <p className="text-xs text-muted-foreground">100% DoD respectée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              US à Compléter
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {incompleteStories.length}
            </div>
            <p className="text-xs text-muted-foreground">DoD incomplète</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total User Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprint24Stories.length}</div>
            <p className="text-xs text-muted-foreground">Sprint 24</p>
          </CardContent>
        </Card>
      </div>

      {/* User Stories avec DoD */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">User Stories - Validation DoD</h2>

        {sprint24Stories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Aucune User Story trouvée pour le Sprint 24.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sprint24Stories.map((story) => {
              const isComplete = story.dodProgress
                ? Object.values(story.dodProgress).every(Boolean)
                : false;

              return (
                <Card
                  key={story.id}
                  className={`border-l-4 ${
                    isComplete ? "border-l-green-500" : "border-l-orange-500"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {story.code} - {story.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {story.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserStoryDoDSummary dodProgress={story.dodProgress} />
                        {isComplete ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Prêt pour clôture
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-orange-500 text-orange-600"
                          >
                            <ArrowRight className="mr-1 h-3 w-3" />À compléter
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <UserStoryDoD
                      dodProgress={story.dodProgress}
                      onUpdate={(newProgress) =>
                        handleDoDUpdate(story.id, newProgress)
                      }
                      showPercentage={false}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
