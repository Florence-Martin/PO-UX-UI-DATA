import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sprint } from "@/lib/types/sprint";

const sprintCollection = collection(db, "sprints");

//  Créer un sprint
export const createSprint = async (
  data: Omit<Sprint, "id" | "progress" | "status">
) => {
  const docRef = await addDoc(sprintCollection, {
    ...data,
    progress: 0,
    status: "planned",
    startDate:
      data.startDate instanceof Date
        ? Timestamp.fromDate(data.startDate)
        : data.startDate,
    endDate:
      data.endDate instanceof Date
        ? Timestamp.fromDate(data.endDate)
        : data.endDate,
  });
  return docRef.id;
};

//  Récupérer tous les sprints
export const getAllSprints = async (): Promise<Sprint[]> => {
  const snapshot = await getDocs(sprintCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Sprint, "id">),
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate(),
  }));
};

//  Récupérer un sprint par ID
export const getSprintById = async (id: string): Promise<Sprint | null> => {
  const docRef = doc(sprintCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id,
      ...(docSnap.data() as Omit<Sprint, "id">),
      startDate: docSnap.data().startDate.toDate(),
      endDate: docSnap.data().endDate.toDate(),
    };
  }
  return null;
};

//  Mettre à jour un sprint
export const updateSprint = async (
  id: string,
  data: Partial<Omit<Sprint, "id">>
) => {
  const docRef = doc(sprintCollection, id);
  await updateDoc(docRef, {
    ...data,
    ...(data.startDate && {
      startDate:
        data.startDate instanceof Date
          ? Timestamp.fromDate(data.startDate)
          : data.startDate,
    }),
    ...(data.endDate && {
      endDate:
        data.endDate instanceof Date
          ? Timestamp.fromDate(data.endDate)
          : data.endDate,
    }),
  });
};

//  Supprimer un sprint + nettoyer les user stories liées
export const deleteSprint = async (sprintId: string) => {
  const sprintRef = doc(db, "sprints", sprintId);
  await deleteDoc(sprintRef);
};
