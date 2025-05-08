"use client";

import { useEffect, useState } from "react";
import {
  createUserStory,
  deleteUserStory,
  getAllUserStories,
  updateUserStory,
} from "@/lib/services/userStoryService";
import { removeUserStoryIdFromTasks } from "@/lib/services/backlogTasksService";
import { UserStory } from "@/lib/types/userStory";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

export function useUserStories() {
  // Formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [moscow, setMoscow] = useState<
    "mustHave" | "shouldHave" | "couldHave" | "wontHave" | ""
  >("");

  // Édition
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  // Données
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedMoscowPriority, setSelectedMoscowPriority] = useState("all");
  const [prioritySearchTerm, setPrioritySearchTerm] = useState("");
  const [userStorySearchTerm, setUserStorySearchTerm] = useState("");

  // Chargement initial
  useEffect(() => {
    refetch();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const stories = await getAllUserStories();
      setUserStories(stories);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des user stories :", err);
      setError("Impossible de charger les user stories.");
      toast.error("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage dynamique
  useEffect(() => {
    const filtered = userStories.filter((story) => {
      const matchesPriority =
        selectedPriority === "all" || story.priority === selectedPriority;
      const matchesMoscow =
        selectedMoscowPriority === "all" ||
        (selectedMoscowPriority === "unprioritized" && !story.moscow) ||
        story.moscow === selectedMoscowPriority;
      const matchesPrioritySearch = story.priority
        .toLowerCase()
        .includes(prioritySearchTerm.toLowerCase());
      const matchesUserStorySearch =
        story.title
          ?.toLowerCase()
          .includes(userStorySearchTerm.toLowerCase()) ||
        "" ||
        story.description
          ?.toLowerCase()
          .includes(userStorySearchTerm.toLowerCase()) ||
        "" ||
        story.code?.toLowerCase().includes(userStorySearchTerm.toLowerCase()) ||
        "";

      return (
        matchesPriority &&
        matchesMoscow &&
        matchesPrioritySearch &&
        matchesUserStorySearch
      );
    });

    setFilteredStories(filtered);
  }, [
    userStories,
    selectedPriority,
    selectedMoscowPriority,
    prioritySearchTerm,
    userStorySearchTerm,
  ]);

  // Reset du formulaire
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setStoryPoints(null);
    setAcceptanceCriteria("");
    setMoscow("");
    setIsEditing(false);
    setEditingId(null);
    setEditingCode(null);
  };

  // Sauvegarde / Mise à jour
  const handleSave = async () => {
    if (!title.trim() || !priority || storyPoints === null) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setLoading(true);

      if (isEditing && editingId) {
        const existingStory = userStories.find((s) => s.id === editingId);
        if (!existingStory) {
          toast.error("User Story introuvable.");
          return;
        }

        const updatedStory: Partial<UserStory> = {
          ...existingStory, // 🛠 garde l'existant (code, createdAt, etc.)
          title: title.trim(),
          description: description.trim(),
          priority,
          storyPoints,
          acceptanceCriteria: acceptanceCriteria.trim(),
          moscow: moscow !== "" ? moscow : null,
          updatedAt: Timestamp.now(),
        };

        // Supprime les champs undefined
        Object.keys(updatedStory).forEach(
          (key) =>
            updatedStory[key as keyof UserStory] === undefined &&
            delete updatedStory[key as keyof UserStory]
        );

        await updateUserStory(editingId, updatedStory);
        toast.success("User Story mise à jour ✏️");
      } else {
        const newStory: Omit<UserStory, "id" | "code"> = {
          title: title.trim(),
          description: description.trim(),
          priority,
          storyPoints,
          acceptanceCriteria: acceptanceCriteria.trim(),
          moscow: moscow !== "" ? moscow : null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const created = await createUserStory(newStory);
        toast.success("User Story créée ✅ (ID : " + created.id + ")");
      }

      resetForm();
      await refetch();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      toast.error("Erreur : Impossible de sauvegarder la User Story.");
    } finally {
      setLoading(false);
    }
  };

  // Chargement en édition
  const handleEdit = (story: UserStory) => {
    setIsEditing(true);
    setEditingId(story.id ?? null);
    setEditingCode(story.code ?? null);
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority);
    setStoryPoints(story.storyPoints);
    setAcceptanceCriteria(story.acceptanceCriteria ?? "");
    setMoscow(story.moscow ?? "");
  };

  // Suppression
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      setLoading(true);
      await deleteUserStory(id);
      await removeUserStoryIdFromTasks(id);
      setUserStories((prev) => prev.filter((story) => story.id !== id));
      toast.success("User Story supprimée ✅");
    } catch (err: any) {
      console.error("Erreur lors de la suppression :", err);

      // Message spécifique si liée à un sprint
      if (err instanceof Error && err.message.includes("liée à un sprint")) {
        toast.error(
          "Impossible de supprimer : cette User Story est liée à un sprint."
        );
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtres manuels
  const filterByPriority = (priority: string) => setSelectedPriority(priority);
  const filterByMoscow = (moscow: string) => setSelectedMoscowPriority(moscow);

  return {
    // Formulaire
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
    moscow,
    setMoscow,

    // Données
    userStories,
    filteredStories,
    loading,
    error,

    // Edition
    isEditing,
    editingCode,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,

    // Filtres
    selectedPriority,
    setSelectedPriority,
    selectedMoscowPriority,
    setSelectedMoscowPriority,
    prioritySearchTerm,
    setPrioritySearchTerm,
    userStorySearchTerm,
    setUserStorySearchTerm,
    filterByPriority,
    filterByMoscow,

    // Rechargement
    refetch,
  };
}
