import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { RoadmapQuarter } from "../types/roadmapQuarter";

const collectionName = "roadmap";

export async function getRoadmapQuarters(): Promise<RoadmapQuarter[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => doc.data() as RoadmapQuarter);
}

export async function saveRoadmapQuarter(data: RoadmapQuarter) {
  console.log("✅ Enregistrement Firestore :", data);
  const ref = doc(db, collectionName, data.id);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: new Date() as any,
    },
    { merge: true }
  );
}

export async function deleteRoadmapQuarter(id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
