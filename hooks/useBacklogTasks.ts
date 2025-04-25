import { useEffect, useState } from "react";
import {
  getAllBacklogTasks,
  createBacklogTask,
  updateBacklogTask,
  deleteBacklogTask,
} from "@/lib/services/backlogTasksService";
import { toast } from "sonner";
import { BacklogTask } from "@/lib/types/backlogTask";
import { taskSchema, sanitize } from "@/lib/utils/taskSchema";

export const useBacklogTasks = () => {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "">("");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const all = await getAllBacklogTasks();
        setTasks(all);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des tâches :", err);
        setError("Impossible de charger les tâches. Veuillez réessayer.");
        toast.error("Erreur : Impossible de charger les tâches.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task: Omit<BacklogTask, "id">) => {
    try {
      const sanitizedTask = {
        ...task,
        title: sanitize(task.title),
        description: sanitize(task.description),
      };

      const { error: validationError, value } =
        taskSchema.validate(sanitizedTask);
      if (validationError) {
        toast.error(validationError.message);
        return;
      }

      const docRef = await createBacklogTask(value);
      setTasks((prev) => [{ ...value, id: docRef.id }, ...prev]);
      toast.success("Tâche ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche :", err);
      toast.error("Erreur : Impossible d'ajouter la tâche.");
    }
  };

  const updateTask = async (task: BacklogTask) => {
    try {
      if (!task.id) throw new Error("ID manquant pour la mise à jour");

      const { id, ...data } = task;
      const sanitized = {
        ...data,
        title: sanitize(data.title || ""),
        description: sanitize(data.description || ""),
      };

      const { error: validationError, value } = taskSchema.validate(sanitized);
      if (validationError) {
        toast.error(validationError.message);
        return;
      }

      await updateBacklogTask(id, value);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...value } : t))
      );

      toast.success("Tâche mise à jour.");
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la tâche :", err);
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
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success("Statut mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      toast.error("Erreur : Impossible de changer le statut.");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteBacklogTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success("Tâche supprimée.");
    } catch (err) {
      console.error("Erreur lors de la suppression de la tâche :", err);
      toast.error("Erreur : Impossible de supprimer la tâche.");
    }
  };

  const getTasksByUserStoryId = (userStoryId: string) =>
    tasks.filter((task) => task.userStoryIds?.includes(userStoryId));

  const todo = tasks.filter((s) => s.status === "todo");
  const inProgress = tasks.filter((s) => s.status === "in-progress");
  const inTesting = tasks.filter((s) => s.status === "in-testing");
  const done = tasks.filter((s) => s.status === "done");

  const handleEdit = (task: BacklogTask) => {
    setIsEditing(true);
    setEditingId(task.id || null);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStoryPoints(task.storyPoints);
  };

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

  return {
    todo,
    inProgress,
    inTesting,
    done,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByUserStoryId,
    handleEdit,
    handleDelete,
    error,
    loading,
    isEditing,
    editingId,
    title,
    description,
    priority,
    storyPoints,
    setIsEditing,
    setTitle,
    setDescription,
    setPriority,
    setStoryPoints,
  };
};
