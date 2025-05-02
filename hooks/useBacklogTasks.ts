"use client";

import { useEffect, useState } from "react";
import {
  getAllBacklogTasks,
  createBacklogTask,
  updateBacklogTask,
  deleteBacklogTask,
} from "@/lib/services/backlogTasksService";
import { toast } from "sonner";
import { BacklogTask } from "@/lib/types/backlogTask";

export function useBacklogTasks() {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await getAllBacklogTasks();
      setTasks(allTasks);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches :", err);
      setError("Impossible de charger les tâches.");
      toast.error("Erreur : Impossible de charger les tâches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<BacklogTask, "id">) => {
    try {
      const docRef = await createBacklogTask(task);
      setTasks((prev) => [{ ...task, id: docRef.id }, ...prev]);
      toast.success("Tâche ajoutée !");
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      toast.error("Erreur : Impossible d'ajouter la tâche.");
    }
  };

  const updateTask = async (task: BacklogTask) => {
    try {
      if (!task.id) throw new Error("ID manquant pour la mise à jour.");

      const { id, ...dataWithoutId } = task;
      await updateBacklogTask(id, dataWithoutId);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...dataWithoutId } : t))
      );
      toast.success("Tâche mise à jour !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      toast.error("Erreur : Impossible de mettre à jour la tâche.");
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    newStatus: BacklogTask["status"]
  ) => {
    try {
      await updateBacklogTask(taskId, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      toast.success("Statut mis à jour !");
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      toast.error("Erreur : Impossible de changer le statut.");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteBacklogTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Tâche supprimée !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      toast.error("Erreur : Impossible de supprimer la tâche.");
    }
  };

  // Fonction pour initier l’édition d’une tâche
  const handleEdit = (task: BacklogTask) => {
    setIsEditing(true);
    setEditingId(task.id || null);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStoryPoints(task.storyPoints);
  };

  // Fonction pour supprimer une tâche (avec toast et état local)
  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      setLoading(true);
      await deleteBacklogTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Tâche supprimée ❌");
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la suppression de la tâche :", err);
      setError("Impossible de supprimer la tâche. Veuillez réessayer.");
      toast.error("Erreur : Impossible de supprimer la tâche.");
    } finally {
      setLoading(false);
    }
  };

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const inTesting = tasks.filter((t) => t.status === "in-testing");
  const done = tasks.filter((t) => t.status === "done");

  return {
    tasks,
    loading,
    error,
    todo,
    inProgress,
    inTesting,
    done,
    fetchTasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    handleEdit,
    handleDelete,
    isEditing,
    editingId,
    title,
    description,
    priority,
    storyPoints,
  };
}
