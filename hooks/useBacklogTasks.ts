import { useEffect, useState } from "react";
import {
  getAllBacklogTasks,
  createBacklogTask,
  updateBacklogTask,
  deleteBacklogTask,
} from "@/lib/services/backlogTasksService";
import { toast } from "sonner";
import { BacklogTask } from "@/lib/types/backlogTask";

export const useBacklogTasks = () => {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      const docRef = await createBacklogTask(task);
      setTasks((prev) => [...prev, { ...task, id: docRef.id }]);
      toast.success("Tâche ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche :", err);
      toast.error("Erreur : Impossible d'ajouter la tâche.");
    }
  };

  // const updateTask = async (task: BacklogTask) => {
  //   try {
  //     if (!task.id) throw new Error("ID manquant pour la mise à jour");
  //     await updateBacklogTask(task.id, task);
  //     setTasks((prev) =>
  //       prev.map((t) => (t.id === task.id ? { ...t, ...task } : t))
  //     );
  //     toast.success("Tâche mise à jour.");
  //   } catch (err) {
  //     console.error("Erreur lors de la mise à jour de la tâche :", err);
  //     toast.error("Erreur : Impossible de mettre à jour la tâche.");
  //   }
  // };

  // const updateTaskStatus = async (
  //   taskId: string,
  //   newStatus: BacklogTask["status"]
  // ) => {
  //   try {
  //     await updateBacklogTask(taskId, { status: newStatus });
  //     setTasks((prev) =>
  //       prev.map((task) =>
  //         task.id === taskId ? { ...task, status: newStatus } : task
  //       )
  //     );
  //     toast.success("Statut mis à jour avec succès !");
  //   } catch (err) {
  //     console.error("Erreur lors du changement de statut :", err);
  //     toast.error("Erreur : Impossible de changer le statut.");
  //   }
  // };
  const updateTask = async (task: BacklogTask) => {
    try {
      if (!task.id) throw new Error("ID manquant pour la mise à jour");

      // ✅ Envoie uniquement les champs modifiés à Firestore
      const { id, ...data } = task;
      await updateBacklogTask(id, data); // data est de type Partial<BacklogTask>

      // 🟢 Met à jour localement
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
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

  const todo = tasks.filter((s) => s.status === "todo");
  const inProgress = tasks.filter((s) => s.status === "in-progress");
  const inTesting = tasks.filter((s) => s.status === "in-testing");
  const done = tasks.filter((s) => s.status === "done");

  return {
    todo,
    inProgress,
    inTesting,
    done,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    error,
    loading,
  };
};
