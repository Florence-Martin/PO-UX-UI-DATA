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

const COLLECTION_NAME = "user_stories";

export const getAllUserStories = async (): Promise<UserStory[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id || "",
    ...doc.data(),
  })) as UserStory[];
};

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

export const deleteUserStory = async (id: string) => {
  const storyRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(storyRef);
};
