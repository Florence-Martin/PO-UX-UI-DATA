import { useEffect, useState } from "react";
import {
  createUserStory,
  deleteUserStory,
  getAllUserStories,
  updateUserStory,
} from "@/lib/services/userStoryService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { UserStory } from "@/lib/types/userStory";

// Hook pour gérer les user stories
export function useUserStories() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "">("");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<UserStory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const stories = await getAllUserStories();
        setUserStories(stories);

        // Par défaut, afficher les user stories avec une priorité "high"
        const highPriorityStories = stories.filter(
          (story) => story.priority === "high"
        );
        setFilteredStories(highPriorityStories);

        setError(null); // Réinitialise l'erreur en cas de succès
      } catch (err) {
        console.error("Erreur lors de la récupération des user stories :", err);
        setError("Impossible de charger les user stories. Veuillez réessayer.");
        toast.error("Erreur : Impossible de charger les user stories.");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("");
    setStoryPoints(null);
    setAcceptanceCriteria("");
  };

  const handleSave = async () => {
    if (!title || !priority || storyPoints === null) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      title,
      description,
      priority,
      storyPoints,
      acceptanceCriteria,
      status: "todo" as "todo",
    };

    try {
      setLoading(true);
      if (isEditing && editingId) {
        await updateUserStory(editingId, payload);
        toast.success("User story mise à jour ✏️");
      } else {
        await createUserStory({
          ...payload,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        toast.success("User story sauvegardée ✅");
      }
      resetForm();
      const updatedStories = await getAllUserStories();
      setUserStories(updatedStories);
      setFilteredStories(updatedStories);
      setError(null); // Réinitialise l'erreur en cas de succès
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la user story :", err);
      setError("Impossible de sauvegarder la user story. Veuillez réessayer.");
      toast.error("Erreur : Impossible de sauvegarder la user story.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour remplir le formulaire avec les données de la user story à éditer
  const handleEdit = (story: UserStory) => {
    setIsEditing(true);
    setEditingId(story.id || null);
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority);
    setStoryPoints(story.storyPoints);
    setAcceptanceCriteria(story.acceptanceCriteria);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      setLoading(true);
      await deleteUserStory(id);
      setUserStories((prev) => prev.filter((story) => story.id !== id));
      setFilteredStories((prev) => prev.filter((story) => story.id !== id));
      toast.success("User story supprimée ❌");
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la suppression de la user story :", err);
      setError("Impossible de supprimer la user story. Veuillez réessayer.");
      toast.error("Erreur : Impossible de supprimer la user story.");
    } finally {
      setLoading(false);
    }
  };

  const filterByPriority = (priority: string) => {
    if (!priority || priority === "all") {
      setFilteredStories(userStories);
    } else {
      const filtered = userStories.filter(
        (story) => story.priority === priority
      );
      setFilteredStories(filtered);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    storyPoints,
    setStoryPoints,
    acceptanceCriteria,
    setAcceptanceCriteria,
    userStories,
    filteredStories,
    filterByPriority,
    isEditing,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    error,
    loading,
  };
}
