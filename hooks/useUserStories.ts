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
import { removeUserStoryIdFromTasks } from "@/lib/services/backlogTasksService";

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
  const [selectedPriority, setSelectedPriority] = useState("high");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const stories = await getAllUserStories();
        setUserStories(stories);
        setError(null);
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

  useEffect(() => {
    const filtered = userStories.filter((story) => {
      const matchesPriority =
        selectedPriority === "all" || story.priority === selectedPriority;
      const matchesSearch =
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPriority && matchesSearch;
    });
    setFilteredStories(filtered);
  }, [userStories, selectedPriority, searchTerm]);

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
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la user story :", err);
      setError("Impossible de sauvegarder la user story. Veuillez réessayer.");
      toast.error("Erreur : Impossible de sauvegarder la user story.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer l'édition d'une user story
  const handleEdit = (story: UserStory) => {
    setIsEditing(true);
    setEditingId(story.id || null);
    setEditingCode(story.code || null);
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
      await removeUserStoryIdFromTasks(id);
      setUserStories((prev) => prev.filter((story) => story.id !== id));
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
    setSelectedPriority(priority);
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
    searchTerm,
    setSearchTerm,
    isEditing,
    editingCode,
    setEditingCode,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    error,
    loading,
  };
}
