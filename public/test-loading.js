// /test-loading.js - Script de test temporaire pour vérifier le chargement des données

console.log("🚀 Test de chargement des données...");

// Test 1: Vérifier que Firebase est bien configuré
setTimeout(() => {
  const firebaseConfigured = typeof window !== "undefined" && window.firebase;
  console.log("✅ Firebase configuré:", !!firebaseConfigured);
}, 1000);

// Test 2: Vérifier que les hooks se déclenchent
setTimeout(() => {
  const hasTimelineData = document.querySelector(
    '[data-testid="timeline-data"]'
  );
  const hasDashboardData = document.querySelector(
    '[data-testid="dashboard-data"]'
  );
  const hasWireframeData = document.querySelector(
    '[data-testid="wireframe-data"]'
  );

  console.log("✅ Données timeline chargées:", !!hasTimelineData);
  console.log("✅ Données dashboard chargées:", !!hasDashboardData);
  console.log("✅ Données wireframes chargées:", !!hasWireframeData);
}, 3000);

// Test 3: Vérifier les erreurs de chargement
setTimeout(() => {
  const errors = document.querySelectorAll('[data-testid="loading-error"]');
  if (errors.length > 0) {
    console.log("❌ Erreurs de chargement détectées:", errors.length);
    errors.forEach((error) => console.log("Erreur:", error.textContent));
  } else {
    console.log("✅ Aucune erreur de chargement détectée");
  }
}, 5000);

export default {};
