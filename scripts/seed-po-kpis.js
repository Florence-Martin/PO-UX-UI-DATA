// Script pour exporter les KPIs PO dans Firebase
// Usage: npm run seed:po-kpis

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

// Charger les variables d'environnement depuis .env
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    // Ignorer les commentaires et lignes vides
    if (!line || line.trim().startsWith("#")) return;

    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim();
      process.env[key.trim()] = value;
    }
  });
  console.log("✅ Variables d'environnement chargées depuis .env");
} else {
  console.error("❌ Fichier .env non trouvé!");
  process.exit(1);
}

// Charger les données JSON
const dataPath = path.join(__dirname, "po-kpis-data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérifier que les variables sont chargées
if (!firebaseConfig.apiKey) {
  console.error("\n❌ Variables Firebase manquantes dans .env!");
  console.log("Assure-toi que .env contient:");
  console.log("  NEXT_PUBLIC_FIREBASE_API_KEY=...");
  console.log("  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...");
  console.log("  etc.\n");
  process.exit(1);
}

console.log("🔐 Initialisation Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonction principale de seeding
async function seedData() {
  try {
    console.log("🚀 Début du seeding...\n");

    // 1. Seed Documented KPIs
    console.log(`📊 Ajout de ${data.documentedKPIs.length} KPIs documentés...`);
    let kpiCount = 0;
    for (const kpi of data.documentedKPIs) {
      await addDoc(collection(db, "documented_kpis"), {
        ...kpi,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      kpiCount++;
      process.stdout.write(
        `   ✓ ${kpiCount}/${data.documentedKPIs.length} KPIs\r`
      );
    }
    console.log(`\n   ✅ ${kpiCount} KPIs ajoutés`);

    // 2. Seed Deliverables
    console.log(`\n📦 Ajout de ${data.deliverables.length} deliverables BI...`);
    let deliverableCount = 0;
    for (const deliverable of data.deliverables) {
      // Mapper les champs du JSON vers le format Firestore attendu
      const deliverableData = {
        name: deliverable.name,
        description: deliverable.description,
        status: deliverable.status,
        priority: deliverable.priority,
        owner: deliverable.owner,
        // Utiliser estimatedDate comme dueDate
        dueDate:
          deliverable.estimatedDate ||
          deliverable.actualDate ||
          new Date().toISOString().split("T")[0],
        category: deliverable.category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "deliverables"), deliverableData);
      deliverableCount++;
      process.stdout.write(
        `   ✓ ${deliverableCount}/${data.deliverables.length} deliverables\r`
      );
    }
    console.log(`\n   ✅ ${deliverableCount} deliverables ajoutés`);

    console.log("\n✅ Seeding terminé avec succès!");
    console.log(`   - ${kpiCount} KPIs documentés`);
    console.log(`   - ${deliverableCount} deliverables BI`);
    console.log("\n🔍 Vérifie sur http://localhost:3000/metrics");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
}

// Lancer le seeding
seedData();
