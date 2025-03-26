import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface BacklogTask {
  id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyPoints: number;
  status: "todo" | "in-progress" | "in-testing" | "done";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

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
