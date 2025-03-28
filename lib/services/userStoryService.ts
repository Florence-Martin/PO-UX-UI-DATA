import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
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

export const createUserStory = async (story: Omit<UserStory, "id">) => {
  const now = Timestamp.now();
  const newStory = {
    ...story,
    createdAt: now,
    updatedAt: now,
  };
  await addDoc(collection(db, COLLECTION_NAME), newStory);
};

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
