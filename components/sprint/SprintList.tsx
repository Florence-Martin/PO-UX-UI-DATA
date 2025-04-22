"use client";

import { useEffect, useState } from "react";
import { deleteSprint } from "@/lib/services/sprintService";
import {
  getAllUserStories,
  updateUserStorySprint,
} from "@/lib/services/userStoryService";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { SprintDetailModal } from "./SprintDetailModal";
import { Button } from "../ui/button";
import { SprintPlanningCard } from "./SprintPlanningCard";
import { useSprints } from "@/hooks/useSprints";

export function SprintList() {
  const { sprints, refetch } = useSprints();
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour charger les User Stories
  const fetchUserStories = async () => {
    try {
      const userStoryData = await getAllUserStories();
      setUserStories(userStoryData);
    } catch (error) {
      console.error("Erreur lors du chargement des User Stories :", error);
    }
  };

  // Charger les User Stories au montage du composant
  useEffect(() => {
    fetchUserStories();
  }, []);

  const handleEdit = (sprint: Sprint) => {
    setSelectedSprint(sprint); // ouvrir modale d’édition
  };

  const handleDelete = async (id: string) => {
    try {
      // Mettre à jour les User Stories associées au sprint supprimé
      const userStoriesToUpdate = userStories.filter(
        (story) => story.sprintId === id
      );
      for (const story of userStoriesToUpdate) {
        await updateUserStorySprint(story.id, null); // Supprime l'association avec le sprint
      }

      // Supprimer le sprint
      await deleteSprint(id);

      // Actualiser les données (sprint et US)
      await refetch();
      fetchUserStories();

      console.log("Sprint supprimé avec succès :", id);
    } catch (error) {
      console.error("Erreur lors de la suppression du sprint :", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-6">
      {/* Bouton pour créer un sprint */}
      <Button onClick={openModal} className="ml-auto mb-4">
        + Créer un sprint
      </Button>

      {sprints.map((sprint) => (
        <SprintPlanningCard
          key={sprint.id}
          sprint={sprint}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Modale de détail ou d'édition */}
      {selectedSprint && (
        <SprintDetailModal
          sprint={selectedSprint}
          userStories={userStories}
          open={!!selectedSprint}
          onClose={() => {
            setSelectedSprint(null);
            refetch(); // Recharge les données après modification
          }}
        />
      )}

      {/* Modale pour créer un sprint */}
      {isModalOpen && (
        <SprintDetailModal
          sprint={null}
          userStories={userStories}
          open={isModalOpen}
          onClose={() => {
            closeModal();
            refetch(); // Recharge les données après création
          }}
        />
      )}
    </div>
  );
}
