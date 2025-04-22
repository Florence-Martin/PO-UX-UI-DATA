// hooks/useSprintForm.ts
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { createSprint } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";

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
    const { title, startDate, endDate, userStoryIds } = formValues;

    if (!title || !startDate || !endDate || userStoryIds.length === 0) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const newSprint: Omit<Sprint, "id" | "progress"> = {
        title,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        userStoryIds,
        velocity: 0,
      };

      await createSprint(newSprint);
      toast.success("Sprint créé avec succès ✅");
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création du sprint :", error);
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
  };
}
