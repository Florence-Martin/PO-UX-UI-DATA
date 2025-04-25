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
import { UserStory } from "../types/userStory";
import { userStorySchema, sanitize } from "@/lib/utils/userStorySchema";

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
  const { error } = userStorySchema.validate(data);
  if (error) {
    throw new Error(`Invalid user story: ${error.message}`);
  }

  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const existingCodes = snapshot.docs.map((doc) => doc.data()?.code || "");

  let nextNumber = 1;
  let code = "";

  do {
    code = `US-${String(nextNumber).padStart(3, "0")}`;
    nextNumber++;
  } while (existingCodes.includes(code));

  const docRef = doc(colRef);
  const story: UserStory = {
    id: docRef.id,
    code,
    ...data,
    title: sanitize(data.title),
    description: sanitize(data.description || ""),
    acceptanceCriteria: sanitize(data.acceptanceCriteria || ""),
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
  const { error } = userStorySchema.validate(story);
  if (error) {
    throw new Error(`Invalid update: ${error.message}`);
  }

  const sanitizedUpdate = {
    ...story,
    title: sanitize(story.title || ""),
    description: sanitize(story.description || ""),
    acceptanceCriteria: sanitize(story.acceptanceCriteria || ""),
  };

  const storyRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(storyRef, {
    ...sanitizedUpdate,
    updatedAt: Timestamp.now(),
  });
};

// Supprime une user story par son ID
export const deleteUserStory = async (id: string) => {
  const storyRef = doc(db, COLLECTION_NAME, id);
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
  await deleteDoc(sprintRef);
};
