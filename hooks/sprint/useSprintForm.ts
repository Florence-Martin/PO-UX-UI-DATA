// hooks/useSprintForm.ts
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { createSprint } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { sprintSchema, sanitize } from "@/lib/utils/sprintSchema";
import { addSprintToUserStory } from "@/lib/services/userStoryService";
import { updateBadgesForSprintUserStories } from "@/lib/utils/updateSprintBadges";
import {
  getAllBacklogTasks,
  updateBacklogTask,
} from "@/lib/services/backlogTasksService";

export function useSprintForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    userStoryIds: [] as string[],
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const resetForm = () => {
    setFormValues({
      title: "",
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
        startDate: Timestamp.fromDate(startDate!),
        endDate: Timestamp.fromDate(endDate!),
        userStoryIds,
        velocity: 0,
        status: "planned",
      };

      const sprintId = await createSprint(newSprint);

      // Mise à jour des US
      await Promise.all(
        userStoryIds.map((usId) => addSprintToUserStory(usId, sprintId))
      );

      // Snippet ajouté ici : Mise à jour des badges pour les User Stories
      await updateBadgesForSprintUserStories(userStoryIds);

      // Mise à jour des tâches associées aux US
      const allTasks = await getAllBacklogTasks();

      const updates = userStoryIds.flatMap((usId) => {
        return allTasks
          .filter((task) => task.userStoryIds?.includes(usId))
          .map((task) =>
            updateBacklogTask(task.id!, {
              ...task,
              badge: "sprint",
            })
          );
      });

      await Promise.all(updates);

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
