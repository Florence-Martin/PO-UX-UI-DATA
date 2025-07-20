import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function testFirebaseConnection() {
  try {
    console.log("Test de connexion Firebase...");

    // Tester la connexion en récupérant les collections
    const collections = ["sprints", "userStories", "backlogTasks"];

    for (const collectionName of collections) {
      console.log(`Test collection: ${collectionName}`);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      console.log(`${collectionName}: ${snapshot.size} documents`);
    }

    console.log("✅ Connexion Firebase réussie");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion Firebase:", error);
    return false;
  }
}

export async function getFirebaseStats() {
  try {
    const stats = {
      sprints: 0,
      userStories: 0,
      backlogTasks: 0,
      timestamp: new Date().toISOString(),
    };

    const collectionsToCheck = ["sprints", "userStories", "backlogTasks"];

    for (const collectionName of collectionsToCheck) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      (stats as any)[collectionName] = snapshot.size;
    }

    return stats;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return null;
  }
}
