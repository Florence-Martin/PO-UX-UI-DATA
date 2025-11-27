// hooks/useRoadmapProgress.ts
import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { getWireframesProgress } from "@/lib/services/progressService";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllUserStories } from "@/lib/services/userStoryService";
import { useEffect, useState } from "react";

interface RoadmapStep {
  id: number;
  label: string;
  progress: number;
}

interface UseRoadmapProgressReturn {
  steps: RoadmapStep[];
  isLoading: boolean;
  error: string | null;
}

export const useRoadmapProgress = (): UseRoadmapProgressReturn => {
  const [steps, setSteps] = useState<RoadmapStep[]>([
    { id: 1, label: "Analyse des besoins", progress: 0 },
    { id: 2, label: "Wireframes", progress: 0 },
    { id: 3, label: "User Stories", progress: 0 },
    { id: 4, label: "Backlog & Kanban", progress: 0 },
    { id: 5, label: "Livrables & Qualité", progress: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les données
        const [sprints, userStories, tasks] = await Promise.all([
          getAllSprints(),
          getAllUserStories(),
          getAllBacklogTasks(),
        ]);

        // Calculer la progression pour chaque étape
        const updatedSteps: RoadmapStep[] = [
          {
            id: 1,
            label: "Analyse des besoins",
            progress: calculateAnalysisProgress(sprints, userStories),
          },
          {
            id: 2,
            label: "Wireframes",
            progress: calculateWireframesProgress(), // ✅ CORRECTION: Retirer le paramètre userStories
          },
          {
            id: 3,
            label: "User Stories",
            progress: calculateUserStoriesProgress(userStories, sprints),
          },
          {
            id: 4,
            label: "Backlog & Kanban",
            progress: calculateBacklogProgress(tasks, sprints, userStories),
          },
          {
            id: 5,
            label: "Livrables & Qualité",
            progress: calculateDeliverablesProgress(sprints, tasks),
          },
        ];

        setSteps(updatedSteps);
      } catch (err) {
        console.error("Erreur lors du calcul de la progression:", err);
        setError("Impossible de charger les données de progression");
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ AJOUT: Écouter les mises à jour des wireframes
    const handleWireframesUpdate = () => {
      calculateProgress();
    };

    calculateProgress();

    // ✅ AJOUT: Event listener pour les mises à jour temps réel
    window.addEventListener(
      "wireframes-progress-updated",
      handleWireframesUpdate
    );

    return () => {
      window.removeEventListener(
        "wireframes-progress-updated",
        handleWireframesUpdate
      );
    };
  }, []);

  return { steps, isLoading, error };
};

// Fonctions de calcul pour chaque étape
const calculateAnalysisProgress = (
  sprints: any[],
  userStories: any[]
): number => {
  // Base: existence de sprints et d'user stories
  const hasInitialData = sprints.length > 0 && userStories.length > 0;
  const hasGoals = sprints.some(
    (sprint) => sprint.goal && sprint.goal.trim() !== ""
  );
  const hasDescriptions = userStories.some(
    (us) => us.description && us.description.trim() !== ""
  );

  let progress = 0;
  if (hasInitialData) progress += 40;
  if (hasGoals) progress += 30;
  if (hasDescriptions) progress += 30;

  return Math.min(progress, 100);
};

// ✅ CORRECTION: Fonction sans paramètre
const calculateWireframesProgress = (): number => {
  return getWireframesProgress();
};

const calculateUserStoriesProgress = (
  userStories: any[],
  sprints: any[]
): number => {
  if (userStories.length === 0) return 0;

  // US avec tous les champs remplis et assignées à un sprint
  const completeUserStories = userStories.filter(
    (us) =>
      us.title &&
      us.description &&
      us.acceptanceCriteria &&
      us.storyPoints > 0 &&
      us.sprintId
  );

  return Math.round((completeUserStories.length / userStories.length) * 100);
};

const calculateBacklogProgress = (
  tasks: any[],
  sprints: any[],
  userStories: any[]
): number => {
  if (tasks.length === 0) return 0;

  // Tâches avec estimation et priorité définies
  const organizedTasks = tasks.filter(
    (task) =>
      task.storyPoints > 0 &&
      task.priority &&
      task.userStoryIds &&
      task.userStoryIds.length > 0
  );

  // ✅ CORRECTION : Ne plus utiliser badge="sprint" comme critère
  // Une tâche est dans un sprint si elle est liée à au moins une US ayant un sprintId
  const tasksInSprints = tasks.filter((task) => {
    if (!task.userStoryIds || task.userStoryIds.length === 0) return false;
    // Vérifier si au moins une US de cette tâche a un sprintId
    return task.userStoryIds.some((usId: string) => {
      const us = userStories.find((u) => u.id === usId);
      return us && us.sprintId;
    });
  });

  const organizationScore = Math.round(
    (organizedTasks.length / tasks.length) * 60
  );
  const sprintScore = Math.round((tasksInSprints.length / tasks.length) * 40);

  return Math.min(organizationScore + sprintScore, 100);
};

const calculateDeliverablesProgress = (
  sprints: any[],
  tasks: any[]
): number => {
  if (sprints.length === 0) return 0;

  const completedSprints = sprints.filter((sprint) => sprint.status === "done");
  const completedTasks = tasks.filter((task) => task.status === "done");

  let progress = 0;

  // 60% basé sur les sprints terminés
  if (sprints.length > 0) {
    progress += Math.round((completedSprints.length / sprints.length) * 60);
  }

  // 40% basé sur les tâches terminées
  if (tasks.length > 0) {
    progress += Math.round((completedTasks.length / tasks.length) * 40);
  }

  return Math.min(progress, 100);
};
