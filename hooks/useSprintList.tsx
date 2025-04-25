import { useState, useEffect } from "react";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { deleteSprint } from "@/lib/services/sprintService";
import {
  getAllUserStories,
  updateUserStorySprint,
} from "@/lib/services/userStoryService";

export function useSprintList(refetch: () => void) {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserStories();
  }, []);

  const fetchUserStories = async () => {
    try {
      const data = await getAllUserStories();
      setUserStories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des User Stories :", error);
    }
  };

  const handleEdit = (sprint: Sprint) => {
    setSelectedSprint(sprint);
  };

  const handleDelete = async (id: string) => {
    try {
      const userStoriesToUpdate = userStories.filter(
        (story) => story.sprintId === id
      );
      for (const story of userStoriesToUpdate) {
        await updateUserStorySprint(story.id, null);
      }

      await deleteSprint(id);
      await refetch();
      fetchUserStories();

      console.log("Sprint supprimé avec succès :", id);
    } catch (error) {
      console.error("Erreur lors de la suppression du sprint :", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    userStories,
    selectedSprint,
    setSelectedSprint,
    isModalOpen,
    openModal,
    closeModal,
    handleEdit,
    handleDelete,
    fetchUserStories,
  };
}
