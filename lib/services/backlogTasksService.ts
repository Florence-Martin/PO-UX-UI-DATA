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

const COLLECTION_NAME = "backlog_tasks";

// 🔍 Récupère les tâches du sprint actif (avec badge "sprint")
export const getAllBacklogTasks = async (): Promise<BacklogTask[]> => {
  const sprintTasksQuery = query(
    collection(db, COLLECTION_NAME),
    where("badge", "==", "sprint")
  );
  const querySnapshot = await getDocs(sprintTasksQuery);
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BacklogTask, "id">),
  }));
};

// 🔍 Récupère TOUTES les tâches (sans filtre badge)
export const getAllBacklogTasksUnfiltered = async (): Promise<
  BacklogTask[]
> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BacklogTask, "id">),
  }));
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

  console.log("[DEBUG] 🔄 Firestore update payload :", {
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
