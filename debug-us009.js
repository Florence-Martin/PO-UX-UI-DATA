// Script de debug pour vérifier l'état de l'US-009
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

const firebaseConfig = {
  // Mettez votre config Firebase ici si nécessaire
  // Ou utilisez les variables d'environnement
};

async function checkUS009() {
  console.log("🔍 Vérification de l'état de l'US-009...");

  try {
    // Si vous avez un fichier de config, l'importer
    // Sinon utiliser les variables d'environnement
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Rechercher l'US-009
    const userStoriesRef = collection(db, "user_stories");
    const q = query(userStoriesRef, where("code", "==", "US-009"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("❌ US-009 non trouvée");
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📋 US-009 trouvée:");
      console.log("  ID:", doc.id);
      console.log("  Code:", data.code);
      console.log("  Title:", data.title);
      console.log("  Badge:", data.badge);
      console.log("  SprintId:", data.sprintId);
      console.log("  Données complètes:", JSON.stringify(data, null, 2));
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

checkUS009();
