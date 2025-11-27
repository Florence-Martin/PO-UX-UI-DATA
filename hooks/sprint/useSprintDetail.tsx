// création / modification

import {
  createBacklogTask,
  getAllBacklogTasks,
} from "@/lib/services/backlogTasksService";
import { createSprint, updateSprint } from "@/lib/services/sprintService";
import {
  getAllUserStories,
  updateUserStorySprint,
} from "@/lib/services/userStoryService";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { sanitize, sprintSchema } from "@/lib/utils/sprintSchema";
import { updateBadgesForSprintUserStories } from "@/lib/utils/updateSprintBadges";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSprintDetail(
  sprint: Sprint | null,
  userStories: UserStory[],
  onClose: () => void,
  refetch: () => void
) {
  const isCreating = sprint === null;
  const router = useRouter();

  const titleRef = useRef<HTMLInputElement>(null);
  const goalRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef<HTMLInputElement>(null);

  const [showStoryList, setShowStoryList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [edited, setEdited] = useState<{ userStoryIds: string[] }>({
    userStoryIds: [],
  });

  useEffect(() => {
    if (sprint) {
      setEdited({
        userStoryIds: userStories
          .filter((us) => us.sprintId === sprint.id)
          .map((us) => us.id),
      });
    }
  }, [sprint, userStories]);

  const toggleUserStorySelection = (storyId: string) => {
    setEdited((prev) => ({
      userStoryIds: prev.userStoryIds.includes(storyId)
        ? prev.userStoryIds.filter((id) => id !== storyId)
        : [...prev.userStoryIds, storyId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawTitle = titleRef.current?.value || "";
    const sanitizedTitle = sanitize(rawTitle); //Assainissement du title via DOMPurify (sanitize(title))
    const goal = goalRef.current?.value || "";
    const startDateStr = startDateRef.current?.value;
    const endDateStr = endDateRef.current?.value;
    const isActive = isActiveRef.current?.checked || false;

    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    // Validation via Joi
    const validationResult = sprintSchema.validate({
      title: sanitizedTitle,
      startDate,
      endDate,
      userStoryIds: edited.userStoryIds,
    });

    if (validationResult.error) {
      toast.error(validationResult.error.message);
      return;
    }

    try {
      if (isCreating) {
        const newSprintId = await createSprint({
          title: sanitizedTitle,
          goal: goal,
          startDate: Timestamp.fromDate(startDate!),
          endDate: Timestamp.fromDate(endDate!),
          userStoryIds: edited.userStoryIds,
          velocity: 0,
          hasReview: false,
          hasRetrospective: false,
          isActive: isActive,
        });

        // Mise à jour des User Stories avec le nouvel ID de sprint
        for (const storyId of edited.userStoryIds) {
          await updateUserStorySprint(storyId, newSprintId);
        }

        // Snippet ajouté ici : Mise à jour des badges pour les User Stories
        await updateBadgesForSprintUserStories(edited.userStoryIds);

        // 🆕 AUTO-CRÉATION DE TÂCHES PAR DÉFAUT
        // ---------------------------------------------------
        // Pour chaque User Story sans tâche existante, créer une tâche par défaut
        // afin que le Sprint Backlog ne soit jamais vide après création
        const allTasks = await getAllBacklogTasks();
        const allUserStoriesData = await getAllUserStories();

        const newTaskCreations = edited.userStoryIds.map(async (usId) => {
          const hasExistingTasks = allTasks.some((task) =>
            task.userStoryIds?.includes(usId)
          );

          if (!hasExistingTasks) {
            const userStory = allUserStoriesData.find(
              (us: UserStory) => us.id === usId
            );

            if (userStory) {
              console.log(
                `🆕 Création tâche par défaut pour: ${userStory.title}`
              );

              const defaultTask: Omit<BacklogTask, "id"> = {
                title: `Implémenter: ${userStory.title}`,
                description: `Tâche principale pour: ${userStory.title}`,
                priority: userStory.priority || "medium",
                storyPoints: userStory.storyPoints || 3,
                status: "todo",
                userStoryIds: [usId],
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
              };

              await createBacklogTask(defaultTask);
            }
          }
        });

        await Promise.all(newTaskCreations);

        toast.success("Sprint créé avec succès !");

        // ✅ Rafraîchir la liste des sprints pour que le nouveau sprint soit visible
        await refetch();

        // ✅ Fermer le modal de création
        onClose();

        // ✅ REDIRECTION AUTOMATIQUE VERS SPRINT BACKLOG
        // ---------------------------------------------------
        // CHOIX UX : Redirection vers l'onglet "Sprint Backlog" (tab=kanban)
        // JUSTIFICATION :
        // - Après création d'un sprint, l'équipe doit créer les tâches techniques
        // - Le Sprint Backlog est la vue d'exécution (Kanban des tâches)
        // - Permet de voir immédiatement les tâches auto-créées avec le bouton "+ Créer"
        // - Plus cohérent qu'aller sur "Sprint actif" qui est une vue synthèse/suivi
        //
        // LOGIQUE DE SPRINT ACTIF :
        // Le sprint nouvellement créé deviendra "actif" selon useActiveSprint() si :
        // 1. Priorité 1 : sprint.isActive === true (coché à la création)
        // 2. Fallback : Date actuelle entre startDate et endDate
        // Donc si l'utilisateur a coché "Marquer comme sprint actif", le sprint
        // sera immédiatement visible dans Sprint Backlog et Sprint actif.
        //
        // MÉCANISME DE RAFRAÎSSEMENT :
        // - refetch() a déjà été appelé ci-dessus
        // - useActiveSprint() utilise un onSnapshot Firestore (temps réel)
        // - getUserStoriesForSprint() utilisera le sprint fraîchement créé
        // - getTasksForSprint() montrera les tâches auto-créées
        //
        // DÉLAI DE 1200ms :
        // - Laisse le temps à Firestore de persister les tâches auto-créées
        // - Permet au snapshot temps réel de useBacklogTasks de se synchroniser
        // - Améliore l'expérience : toast visible + transition fluide + tâches visibles
        setTimeout(() => {
          router.push("/sprint?tab=kanban");
        }, 1200);

        // ⚠️ ATTENTION : Le return ci-dessous empêche l'exécution du code après
        return;
      } else {
        await updateSprint(sprint.id, {
          title: sanitizedTitle,
          goal: goal,
          startDate: Timestamp.fromDate(startDate!),
          endDate: Timestamp.fromDate(endDate!),
          userStoryIds: edited.userStoryIds,
          hasReview: sprint.hasReview || false,
          hasRetrospective: sprint.hasRetrospective || false,
          isActive: isActive,
        });

        for (const story of userStories) {
          const shouldBeLinked = edited.userStoryIds.includes(story.id);
          const alreadyLinked = story.sprintId === sprint.id;

          if (shouldBeLinked && !alreadyLinked) {
            await updateUserStorySprint(story.id, sprint.id);
          } else if (!shouldBeLinked && alreadyLinked) {
            await updateUserStorySprint(story.id, null);
          }
        }

        toast.success("Sprint modifié avec succès !");

        // ✅ Rafraîchir et fermer pour la modification
        await refetch();
        onClose();
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du sprint", err);
      toast.error("Erreur lors de l'enregistrement du sprint.");
    }
  };

  const usedUserStoryIds = userStories
    .filter((us) => us.sprintId && us.sprintId !== sprint?.id)
    .map((us) => us.id);

  const filteredStories = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    isCreating,
    titleRef,
    goalRef,
    startDateRef,
    endDateRef,
    isActiveRef,
    showStoryList,
    setShowStoryList,
    searchTerm,
    setSearchTerm,
    edited,
    toggleUserStorySelection,
    handleSubmit,
    usedUserStoryIds,
    filteredStories,
  };
}
