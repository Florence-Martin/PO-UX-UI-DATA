# 📊 Page /metrics - Documentation Dynamique

## 🎯 Objectif

La page `/metrics` a été transformée de **statique** en **dynamique** avec ISR (Incremental Static Regeneration).

## 🔄 Configuration

```typescript
// app/metrics/page.tsx
export const revalidate = 60; // ISR : Revalide toutes les 60 secondes
export const dynamic = "force-dynamic"; // Force le rendu côté serveur
```

## 📦 Collections Firebase

### 1. `documented_kpis`

Collection pour documenter les KPIs métiers **orientés Product Owner**.

```typescript
interface DocumentedKPI {
  id: string;
  name: string; // Ex: "Vélocité de l'Équipe"
  definition: string; // Définition claire du KPI
  source: string; // Ex: "Jira / Azure DevOps"
  objective: string; // Objectif chiffré
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  owner: string; // Responsable
  category?:
    | "product" // 📦 Santé produit (Feature Adoption, TTV, NPS)
    | "agile" // 🏃 Performance Agile (Vélocité, Lead Time)
    | "business" // 💰 Impact Business (RPU, CLV, Conversion)
    | "ux" // 👥 UX (SUS, Rebond, Usabilité)
    | "quality" // 🔧 Qualité (Bug Escape Rate, Support)
    | "marketing"
    | "sales"
    | "technical";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

**📊 KPIs recommandés pour un Product Owner** :

#### 📦 Product Health (4 KPIs)
- Taux d'Adoption des Nouvelles Fonctionnalités
- Time to Value (TTV)
- Feature Usage Rate
- Net Promoter Score (NPS)

#### 🏃 Delivery Performance (4 KPIs)
- Vélocité de l'Équipe
- Taux de Complétion des Sprints
- Lead Time (Idée → Production)
- Cycle Time (Dev → Prod)

#### 💰 Business Impact (4 KPIs)
- Revenue per User (RPU)
- Taux de Conversion Global
- Customer Lifetime Value (CLV)
- Taux de Rétention (D7/D30)

#### 👥 User Experience (4 KPIs)
- System Usability Scale (SUS)
- Taux de Rebond
- Bug Escape Rate
- Volume de Tickets Support

### 2. `deliverables`

Collection pour tracker les livrables BI/Data.

```typescript
interface Deliverable {
  id: string;
  name: string; // Ex: "Dashboard Conversion"
  status: "completed" | "in_progress" | "delayed" | "pending";
  dueDate: string; // Format: "YYYY-MM-DD"
  owner: string; // Équipe responsable
  description?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

## 🌱 Seed des données

Pour tester la page avec des données de démo :

```bash
# Installer ts-node si nécessaire
npm install -D ts-node

# Exécuter le script de seed
npx ts-node scripts/seed-metrics.ts
```

Le script créera :
- ✅ 4 KPIs documentés (Conversion, Rebond, NPS, CLV)
- ✅ 4 Livrables BI (Dashboard, Rapport, KPIs, Migration)

## 🚀 Services disponibles

### DocumentedKPIService

```typescript
import {
  getDocumentedKPIs,
  createDocumentedKPI,
  updateDocumentedKPI,
  deleteDocumentedKPI,
  formatFrequency,
} from "@/lib/services/documentedKPIService";

// Récupérer tous les KPIs
const kpis = await getDocumentedKPIs();

// Créer un KPI (nouveau format avec dataSources et visualizationType)
const id = await createDocumentedKPI({
  name: "Feature Adoption Rate",
  definition: "% d'utilisateurs utilisant une nouvelle feature dans les 30 jours",
  category: "product",
  frequency: "weekly",
  owner: "Product Owner",
  target: "≥ 40%",
  dataSources: ["Analytics", "Feature Flags"],
  visualizationType: "line",
});

// Mettre à jour un KPI (filtre automatique des undefined)
await updateDocumentedKPI(id, {
  target: "≥ 50%",
  visualizationType: "bar",
});

// Supprimer un KPI
await deleteDocumentedKPI(id);
```

**Note** : Le service filtre automatiquement les valeurs `undefined` avant `updateDoc` pour éviter les erreurs Firestore.

### DeliverableService

```typescript
import {
  getDeliverables,
  createDeliverable,
  updateDeliverable,
  deleteDeliverable,
  calculateDeliverableStats,
} from "@/lib/services/deliverableService";

// Récupérer tous les livrables
const deliverables = await getDeliverables();

// Créer un livrable
const id = await createDeliverable({
  name: "Dashboard Vélocité & Burndown",
  description: "Tableau de bord temps réel avec vélocité et prédictions",
  status: "in_progress",
  dueDate: "2025-12-31",
  owner: "Data Analyst",
});

// Mettre à jour (filtre automatique des undefined)
await updateDeliverable(id, {
  status: "completed",
  description: "Dashboard complété avec alertes automatiques",
});

// Supprimer un livrable
await deleteDeliverable(id);

// Calculer les stats
const stats = calculateDeliverableStats(deliverables);
// { total, completed, inProgress, delayed, pending, completionRate }
```

**Note** : Le service filtre automatiquement les valeurs `undefined` avant `updateDoc`.

## 🎨 Composants UI

### Modals KPI

#### AddKpiModal
```tsx
<AddKpiModal 
  open={showAddModal} 
  onOpenChange={setShowAddModal} 
  onSuccess={() => router.refresh()} 
/>
```
Formulaire de création avec tous les champs : nom, définition, catégorie, fréquence, responsable, objectif, sources de données, type de visualisation.

#### EditKpiModal
```tsx
<EditKpiModal 
  open={!!editingKpi} 
  onOpenChange={(open) => !open && setEditingKpi(null)}
  kpi={editingKpi}
  onSuccess={() => router.refresh()} 
/>
```
Formulaire pré-rempli pour modifier un KPI existant. Gère le reset automatique à l'ouverture.

#### DeleteKpiModal
```tsx
<DeleteKpiModal 
  open={!!deletingKpi} 
  onOpenChange={(open) => !open && setDeletingKpi(null)}
  kpi={deletingKpi}
  onSuccess={() => router.refresh()} 
/>
```
Dialog de confirmation avec icône AlertTriangle et message d'avertissement.

### Modals Deliverable

#### AddDeliverableModal
Formulaire de création : nom, description, statut, priorité, catégorie, échéance, responsable.

#### EditDeliverableModal
Formulaire pré-rempli pour modifier un livrable. Champs : name, description, status, dueDate, owner.

#### DeleteDeliverableModal
Dialog de confirmation pour suppression de livrable.

---

### KpiDocumentation

Composant client pour afficher et gérer les KPIs documentés avec CRUD complet.

```tsx
<KpiDocumentation kpis={documentedKPIs} />
```

**Fonctionnalités** :
- ✅ Recherche en temps réel (nom + définition)
- ✅ Filtrage par catégorie (product, agile, business, ux, quality)
- ✅ Statistiques par catégorie (badges cliquables)
- ✅ Affichage enrichi (icônes de visualisation, badges catégories)
- ✅ **CRUD complet** :
  - ➕ Création via modal `AddKpiModal`
  - ✏️ Édition via modal `EditKpiModal` (bouton crayon)
  - 🗑️ Suppression via modal `DeleteKpiModal` (bouton poubelle avec confirmation)
- ✅ Toast notifications (sonner)
- ✅ Auto-refresh après mutations (router.refresh())
- ✅ Responsive mobile/desktop

### DeliverableTracking

Composant client pour suivre et gérer les livrables BI avec CRUD complet.

```tsx
<DeliverableTracking deliverables={deliverables} />
```

**Fonctionnalités** :
- ✅ Statistiques par statut (cards cliquables pour filtrer)
- ✅ Filtrage dynamique par statut (completed, in_progress, delayed, pending)
- ✅ Icônes de statut colorées (✓ vert, ⏱ bleu, ⚠ rouge, ○ gris)
- ✅ Badges enrichis (statut + priorité si disponible)
- ✅ Affichage détaillé (catégorie, échéance, responsable, description)
- ✅ **CRUD complet** :
  - ➕ Création via modal `AddDeliverableModal`
  - ✏️ Édition via modal `EditDeliverableModal` (bouton crayon)
  - 🗑️ Suppression via modal `DeleteDeliverableModal` (bouton poubelle avec confirmation)
- ✅ Toast notifications (sonner)
- ✅ Auto-refresh après mutations (router.refresh())
- ✅ Responsive mobile/desktop avec ScrollArea

## 📊 Build Output

```bash
npm run build

# Avant : ○ /metrics (Static)
# Après :  ƒ /metrics (Dynamic)
```

## ⚡ Performance

- **Revalidation** : 60 secondes (modifiable via `export const revalidate`)
- **Mode** : Server-Side Rendering (SSR) avec cache
- **First Load JS** : ~241 kB
- **Optimisation** : 
  - Données fetchées côté serveur (HTML pré-rendu)
  - Timestamps Firebase convertis en ISO strings (évite les warnings)
  - router.refresh() après mutations (cache invalidation)
  - Toast notifications (sonner) pour feedback immédiat
  - Logger centralisé (console.error remplacé par logger.error)

## 🔐 Sécurité Firebase

⚠️ **Important** : En mode démo, les règles Firebase sont ouvertes :

```javascript
// Firestore Rules (DEMO ONLY)
allow read, write: if true;
```

**Pour la production**, mettre en place l'authentification et des règles strictes :

```javascript
// Firestore Rules (PRODUCTION)
match /documented_kpis/{kpiId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.token.role == "admin";
}

match /deliverables/{deliverableId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.token.role == "admin";
}
```

## 🧪 Tests

Les services sont testables avec Jest :

```typescript
// Tests à créer
describe("DocumentedKPIService", () => {
  it("should fetch all documented KPIs", async () => {
    const kpis = await getDocumentedKPIs();
    expect(Array.isArray(kpis)).toBe(true);
  });
  
  it("should filter undefined values in updateDocumentedKPI", async () => {
    // Le service doit filtrer les undefined avant updateDoc
    await updateDocumentedKPI(kpiId, {
      target: "50%",
      category: undefined, // Ne doit pas être envoyé à Firestore
    });
  });
});

describe("DeliverableService", () => {
  it("should calculate stats correctly", () => {
    const deliverables = [
      { status: "completed" },
      { status: "in_progress" },
      { status: "delayed" },
      { status: "pending" },
    ];
    const stats = calculateDeliverableStats(deliverables);
    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(1);
    expect(stats.completionRate).toBe(25);
  });
});

describe("KpiDocumentation", () => {
  it("should filter KPIs by search term", () => {
    // Test du filtre de recherche
  });
  
  it("should filter KPIs by category", () => {
    // Test du filtre de catégorie
  });
});
```

## 📝 Prochaines étapes

- [x] ~~Implémenter le formulaire "Nouveau KPI"~~ ✅ AddKpiModal
- [x] ~~Implémenter le formulaire "Nouveau Livrable"~~ ✅ AddDeliverableModal
- [x] ~~Ajouter la modification/suppression inline~~ ✅ Edit/Delete modals
- [x] ~~Ajouter des filtres (catégorie, statut)~~ ✅ Filtres dynamiques
- [ ] Ajouter l'export CSV/Excel
- [ ] Créer un dashboard de synthèse avec graphiques (Recharts)
- [ ] Ajouter la pagination (si > 50 items)
- [ ] Implémenter le tri (par date, nom, catégorie)
- [ ] Ajouter des graphiques d'évolution temporelle des KPIs

## 🎓 Ressources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
