import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { BacklogTask } from "../types/backlogTask";
import { logger } from "../utils/logger";
import { getAllSprints } from "./sprintService";
import { getAllUserStories } from "./userStoryService";

const COLLECTION_NAME = "backlog_tasks";

// 🔍 Récupère TOUTES les tâches (sans filtre badge)
// ✅ CORRECTION : Ne plus filtrer par badge="sprint" car badge n'est plus la source de vérité
// Les consommateurs de cette fonction (Timeline, Roadmap, etc.) doivent filtrer par userStoryIds
export const getAllBacklogTasks = async (): Promise<BacklogTask[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BacklogTask, "id">),
  }));
};

// 🎯 Récupère les tâches du sprint actif basé sur les User Stories
export const getActiveSprintTasks = async (): Promise<BacklogTask[]> => {
  try {
    // 1. Récupérer le sprint actif
    const sprints = await getAllSprints();
    const activeSprint = sprints.find((sprint) => sprint.status !== "done");

    if (!activeSprint) {
      logger.info("Aucun sprint actif trouvé");
      return [];
    }

    // 2. Récupérer les User Stories du sprint actif
    const userStories = await getAllUserStories();
    const activeUserStoryIds = userStories
      .filter((us) => us.sprintId === activeSprint.id)
      .map((us) => us.id)
      .filter((id) => id !== undefined) as string[];

    logger.info(`User Stories du sprint actif: ${activeUserStoryIds.length}`);

    // 3. Récupérer toutes les tâches
    const allTasksSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const allTasks = allTasksSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<BacklogTask, "id">),
    }));

    // 4. Filtrer les tâches qui sont liées aux User Stories du sprint actif
    const activeSprintTasks = allTasks.filter((task) => {
      if (!task.userStoryIds || task.userStoryIds.length === 0) {
        return false;
      }
      return task.userStoryIds.some((usId) =>
        activeUserStoryIds.includes(usId)
      );
    });

    logger.info(`Tâches du sprint actif trouvées: ${activeSprintTasks.length}`);
    return activeSprintTasks;
  } catch (error) {
    logger.error(
      "Erreur lors de la récupération des tâches du sprint actif:",
      error
    );
    return [];
  }
};

// ➕ Crée une nouvelle tâche
export const createBacklogTask = async (task: Omit<BacklogTask, "id">) => {
  const now = Timestamp.now();
  const newTask = {
    ...task,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newTask);
  return { id: docRef.id, ...newTask };
};

// ✏️ Met à jour une tâche (sans sanitization)
export const updateBacklogTask = async (
  id: string,
  updatedFields: Partial<BacklogTask>
) => {
  const taskRef = doc(db, "backlog_tasks", id);

  logger.debug("🔄 Firestore update payload :", {
    id,
    ...updatedFields,
  });

  await updateDoc(taskRef, {
    ...updatedFields,
    updatedAt: new Date(),
  });
};

// ❌ Supprime une tâche
export const deleteBacklogTask = async (id: string) => {
  const taskRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(taskRef);
};

// 🔁 Supprime une userStoryId dans toutes les tâches concernées
export const removeUserStoryIdFromTasks = async (userStoryId: string) => {
  const tasksRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(
    query(tasksRef, where("userStoryIds", "array-contains", userStoryId))
  );

  const updatePromises = snapshot.docs.map((docSnap) => {
    const taskRef = doc(db, COLLECTION_NAME, docSnap.id);
    return updateDoc(taskRef, {
      userStoryIds: arrayRemove(userStoryId),
      updatedAt: Timestamp.now(),
    });
  });

  await Promise.all(updatePromises);
};
