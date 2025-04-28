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
  };
}
