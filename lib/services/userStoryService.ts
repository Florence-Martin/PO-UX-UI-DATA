import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { UserStory } from "../types/userStory";

const COLLECTION_NAME = "user_stories";

// Récupère toutes les user stories
export const getAllUserStories = async (): Promise<UserStory[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id || "",
    ...doc.data(),
  })) as UserStory[];
};

// Création d'une nouvelle user story
export async function createUserStory(data: Omit<UserStory, "id" | "code">) {
  const colRef = collection(db, "user_stories");

  // Récupère tous les codes existants pour éviter les doublons
  const snapshot = await getDocs(colRef);
  const existingCodes = snapshot.docs.map((doc) => doc.data()?.code || "");

  let nextNumber = 1;
  let code = "";

  // Génère un code unique du type US-001, US-002, ...
  do {
    code = `US-${String(nextNumber).padStart(3, "0")}`;
    nextNumber++;
  } while (existingCodes.includes(code));

  const docRef = doc(colRef);
  const story: UserStory = {
    id: docRef.id,
    code,
    ...data,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };

  await setDoc(docRef, story);

  return story;
}

// Mise à jour user story par son ID
export const updateUserStory = async (
  id: string,
  story: Partial<UserStory>
) => {
  const storyRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(storyRef, {
    ...story,
    updatedAt: Timestamp.now(),
  });
};

// Supprime une user story par son ID si elle n'est pas liée à un sprint
export const deleteUserStory = async (id: string) => {
  const storyRef = doc(db, COLLECTION_NAME, id);
  const storySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  const story = storySnapshot.docs.find((doc) => doc.id === id)?.data();
  if (story?.sprintId) {
    throw new Error(
      "Impossible de supprimer cette User Story : elle est liée à un sprint."
    );
  }

  await deleteDoc(storyRef);
};

// Récupère les IDs des user stories utilisées dans les tâches
export const getUsedUserStoryIds = async (): Promise<string[]> => {
  const querySnapshot = await getDocs(collection(db, "backlog_tasks"));
  const usedIds = new Set<string>();
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    (data.userStoryIds || []).forEach((id: string) => usedIds.add(id));
  });
  return Array.from(usedIds);
};

// Récupère les user stories filtrées par Moscow
export const getUserStoriesByMoscow = async () => {
  const stories = await getAllUserStories();
  return {
    mustHave: stories.filter((s) => s.moscow === "mustHave"),
    shouldHave: stories.filter((s) => s.moscow === "shouldHave"),
    couldHave: stories.filter((s) => s.moscow === "couldHave"),
    wontHave: stories.filter((s) => s.moscow === "wontHave"),
  };
};

export const updateUserStorySprint = async (
  userStoryId: string,
  sprintId: string | null
) => {
  const ref = doc(db, "user_stories", userStoryId);
  await updateDoc(ref, { sprintId });
};

export const deleteSprint = async (sprintId: string) => {
  const sprintRef = doc(db, "sprints", sprintId);
  try {
    await deleteDoc(sprintRef);
    toast.success("Sprint supprimé ✅");
  } catch (err: any) {
    toast.error(err.message || "Erreur lors de la suppression du sprint.");
  }
};

export async function addSprintToUserStory(
  userStoryId: string,
  sprintId: string
) {
  const userStoryRef = doc(db, "user_stories", userStoryId);
  await updateDoc(userStoryRef, {
    sprintId: sprintId,
  });
}
