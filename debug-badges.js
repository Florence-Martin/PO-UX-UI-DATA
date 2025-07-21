// Script de débogage pour analyser les badges des sprints terminés
// À exécuter avec: node debug-badges.js

console.log("🔍 Analyse des badges des sprints terminés...");

// Simulation de la logique de nettoyage pour identifier les problèmes
function debugBadgeCleanup() {
  console.log("\n📊 Points de vérification:");
  console.log("1. ✅ Sprints avec status='done'");
  console.log("2. ✅ User Stories liées aux sprints terminés");
  console.log("3. ✅ Tâches avec badge='sprint' ET liées aux US");
  console.log("4. ✅ Mise à jour badge: null");

  console.log("\n🔍 Problèmes potentiels:");
  console.log("- Connexion Firestore");
  console.log("- Permissions d'écriture");
  console.log("- Tâches sans userStoryIds");
  console.log("- Sprint status différent de 'done'");
  console.log("- Collection 'userStories' vs 'user_stories'");

  console.log("\n💡 Pour diagnostiquer:");
  console.log("1. Vérifiez la console du navigateur");
  console.log("2. Contrôlez les données Firestore");
  console.log("3. Testez avec une tâche spécifique");
}

debugBadgeCleanup();
