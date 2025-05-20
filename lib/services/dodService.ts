import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { DoD, DoDItem } from "../types/dod";

// Collection reference
const DOD_COLLECTION = "definitionOfDone";
const DEFAULT_DOD_ID = "default";

// Default DoD items if none exist in Firestore
const DEFAULT_DOD_ITEMS: DoDItem[] = [
  { id: "1", text: "Code relu par un pair", checked: false, order: 0 },
  { id: "2", text: "Tests unitaires écrits", checked: false, order: 1 },
  { id: "3", text: "Fonction testée en local", checked: false, order: 2 },
  { id: "4", text: "Fonction validée en staging", checked: false, order: 3 },
  { id: "5", text: "Documentation mise à jour", checked: false, order: 4 },
  {
    id: "6",
    text: 'Ticket passé en "Done" sur Jira / Kanban',
    checked: false,
    order: 5,
  },
];

// Get DoD from Firestore with error handling
export const getDoD = async (dodId: string = DEFAULT_DOD_ID): Promise<DoD> => {
  try {
    const docRef = doc(db, DOD_COLLECTION, dodId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DoD;
    } else {
      // Create default DoD if it doesn't exist
      const defaultDoD: DoD = {
        id: dodId,
        items: DEFAULT_DOD_ITEMS,
        lastUpdated: Timestamp.now(),
        lastUpdatedBy: "system",
      };

      try {
        await setDoc(docRef, defaultDoD);
      } catch (error) {
        console.warn(
          "Failed to create default DoD, using local fallback",
          error
        );
      }
      return defaultDoD;
    }
  } catch (error) {
    console.warn("Failed to fetch DoD, using local fallback", error);
    // Return default data when offline
    return {
      id: dodId,
      items: DEFAULT_DOD_ITEMS,
      lastUpdated: Timestamp.now(),
      lastUpdatedBy: "system",
    };
  }
};

// Update DoD in Firestore with error handling
export const updateDoD = async (dod: DoD): Promise<void> => {
  try {
    const docRef = doc(db, DOD_COLLECTION, dod.id);
    await setDoc(docRef, {
      ...dod,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.warn(
      "Failed to update DoD, changes will be synced when online",
      error
    );
    // The update will be automatically synced when the connection is restored
    // thanks to offline persistence
  }
};

// Update a single item's checked status with error handling
export const updateDoDItemStatus = async (
  dodId: string = DEFAULT_DOD_ID,
  itemId: string,
  checked: boolean,
  updatedBy: string = "user"
): Promise<void> => {
  try {
    const dod = await getDoD(dodId);

    const updatedItems = dod.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, checked };
      }
      return item;
    });

    await updateDoD({
      ...dod,
      items: updatedItems,
      lastUpdated: Timestamp.now(),
      lastUpdatedBy: updatedBy,
    });
  } catch (error) {
    console.warn(
      "Failed to update item status, changes will be synced when online",
      error
    );
  }
};

// Subscribe to real-time updates with error handling
export const subscribeToDoDChanges = (
  dodId: string = DEFAULT_DOD_ID,
  callback: (dod: DoD) => void
): Unsubscribe => {
  const docRef = doc(db, DOD_COLLECTION, dodId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as DoD);
      } else {
        // Create default if it doesn't exist yet
        getDoD(dodId).then(callback);
      }
    },
    (error) => {
      console.warn("Error listening to DoD changes, using local data", error);
      // Return default data when offline
      callback({
        id: dodId,
        items: DEFAULT_DOD_ITEMS,
        lastUpdated: Timestamp.now(),
        lastUpdatedBy: "system",
      });
    }
  );
};
