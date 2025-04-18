import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { BacklogTask } from "../types/backlogTask";

const COLLECTION_NAME = "backlog_tasks";

export const getAllBacklogTasks = async (): Promise<BacklogTask[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BacklogTask, "id">),
  }));
};

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

export const updateBacklogTask = async (
  id: string,
  updates: Partial<BacklogTask>
) => {
  if (!id)
    throw new Error(
      "L'identifiant de la tâche est requis pour la mise à jour."
    );
  const taskRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBacklogTask = async (id: string) => {
  const taskRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(taskRef);
};

// Supprime l’ID d’une user story dans toutes les tâches qui la contiennent
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
