import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";

import {
  createBacklogTask,
  getAllBacklogTasks,
  updateBacklogTask,
} from "@/lib/services/backlogTasksService";
import { createSprint } from "@/lib/services/sprintService";
import {
  addSprintToUserStory,
  getAllUserStories,
  updateUserStory,
} from "@/lib/services/userStoryService";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { sanitize, sprintSchema } from "@/lib/utils/sprintSchema";
import { updateBadgesForSprintUserStories } from "@/lib/utils/updateSprintBadges";

export function useSprintForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    goal: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    userStoryIds: [] as string[],
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const resetForm = () => {
    setFormValues({
      title: "",
      goal: "",
      startDate: undefined,
      endDate: undefined,
      userStoryIds: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    type: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [type]: date,
    }));
  };

  const handleCheckboxChange = (storyId: string) => {
    setFormValues((prev) => ({
      ...prev,
      userStoryIds: prev.userStoryIds.includes(storyId)
        ? prev.userStoryIds.filter((id) => id !== storyId)
        : [...prev.userStoryIds, storyId],
    }));
  };

  const handleSubmit = async () => {
    const sanitizedTitle = sanitize(formValues.title);

    const validationResult = sprintSchema.validate({
      title: sanitizedTitle,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      userStoryIds: formValues.userStoryIds,
    });

    if (validationResult.error) {
      toast.error(validationResult.error.message);
      return;
    }

    const { startDate, endDate, userStoryIds } = formValues;

    try {
      const newSprint: Omit<Sprint, "id" | "progress"> = {
        title: sanitizedTitle,
        goal: sanitize(formValues.goal),
        startDate: Timestamp.fromDate(startDate!),
        endDate: Timestamp.fromDate(endDate!),
        userStoryIds,
        velocity: 0,
        status: "planned",
        hasReview: false,
        hasRetrospective: false,
      };

      const sprintId = await createSprint(newSprint);

      // Mise à jour des US (ajout sprintId + badge)
      await Promise.all(
        userStoryIds.map(async (usId) => {
          await addSprintToUserStory(usId, sprintId);
          await updateUserStory(usId, { badge: "sprint" });
        })
      );

      await updateBadgesForSprintUserStories(userStoryIds);

      // Mise à jour des tâches existantes associées aux US
      const allTasks = await getAllBacklogTasks();

      const existingTaskUpdates = userStoryIds.flatMap((usId) => {
        return allTasks
          .filter((task) => task.userStoryIds?.includes(usId))
          .map((task) =>
            updateBacklogTask(task.id!, {
              ...task,
              badge: "sprint",
            })
          );
      });

      await Promise.all(existingTaskUpdates);

      // 🆕 Créer automatiquement des tâches par défaut pour les US sans tâches
      const userStoriesData = await getAllUserStories();
      const newTaskCreations = userStoryIds.map(async (usId) => {
        // Vérifier si cette US a déjà des tâches associées
        const hasExistingTasks = allTasks.some((task) =>
          task.userStoryIds?.includes(usId)
        );

        if (!hasExistingTasks) {
          // Récupérer les infos de l'US pour créer une tâche appropriée
          const userStory = userStoriesData.find(
            (us: UserStory) => us.id === usId
          );

          if (userStory) {
            console.log(
              `🆕 Création d'une tâche par défaut pour l'US: ${userStory.title}`
            );

            // Créer une tâche par défaut pour cette User Story
            const defaultTask: Omit<BacklogTask, "id"> = {
              title: `Implémenter: ${userStory.title}`,
              description: `Tâche principale pour implémenter la User Story: ${userStory.title}`,
              priority: userStory.priority || "medium",
              storyPoints: userStory.storyPoints || 3,
              status: "todo",
              userStoryIds: [usId],
              badge: "sprint", // Directement avec le badge sprint
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            };

            await createBacklogTask(defaultTask);
          }
        }
      });

      await Promise.all(newTaskCreations);

      toast.success("Sprint créé avec succès ✅");
      resetForm();
      closeModal();
    } catch (error) {
      console.error(
        "Erreur lors de la création du sprint ou de la mise à jour :",
        error
      );
      toast.error("Une erreur est survenue.");
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    formValues,
    handleInputChange,
    handleDateChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
  };
}
