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

// Validation des entrées de sprint
//  Vérifier que le titre du sprint est valide et que les dates sont correctes
export const validateSprintInput = (data: Partial<Sprint>) => {
  if (!data.title || data.title.trim().length < 3) {
    throw new Error(
      "Sprint title is required and must be at least 3 characters long."
    );
  }
  if (!data.startDate || !data.endDate) {
    throw new Error("Start and end dates are required.");
  }
  const start =
    data.startDate instanceof Date ? data.startDate : data.startDate.toDate();
  const end =
    data.endDate instanceof Date ? data.endDate : data.endDate.toDate();
  if (start > end) {
    throw new Error("Start date must be before end date.");
  }
};

//  Créer un sprint
export const createSprint = async (
  data: Omit<Sprint, "id" | "progress" | "status">
) => {
  validateSprintInput(data);
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
  validateSprintInput(data);
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
