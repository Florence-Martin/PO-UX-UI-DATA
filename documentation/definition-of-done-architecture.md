# Architecture Definition of Done (DoD)

## 📋 Vue d'ensemble

Le système de Definition of Done (DoD) permet à chaque User Story d'avoir **sa propre checklist de critères de qualité** avec des états de validation indépendants. La DoD est **synchronisée en temps réel** entre toutes les vues de l'application.

## 🏗️ Architecture

### Type de données

```typescript
// lib/types/dod.ts
export interface DoDItem {
  id: string;           // Identifiant unique du critère
  text: string;         // Libellé du critère (ex: "Tests unitaires écrits")
  checked: boolean;     // État de validation
  order: number;        // Ordre d'affichage
}

// lib/types/userStory.ts
export interface UserStory extends BaseWorkItem {
  // ... autres champs
  dodItems?: DoDItem[];  // 🆕 Nouveau système (flexible)
  dodProgress?: DoDProgress; // ⚠️ DEPRECATED (6 booléens fixes)
}
```

### Critères par défaut

Les 6 critères initialisés automatiquement pour chaque nouvelle User Story :

1. **Code relu par un pair**
2. **Tests automatisés écrits et fonctionnels**
3. **Fonction testée en local**
4. **Fonction validée en staging**
5. **Documentation mise à jour**
6. **Ticket passé en Done**

## 🔄 Flux de données

```
┌─────────────────────┐
│  Création US        │
│  (userStoryService) │
└──────────┬──────────┘
           │
           │ getDefaultDoDItems()
           ▼
┌─────────────────────────┐
│  dodItems initialisés   │
│  [6 critères unchecked] │
└──────────┬──────────────┘
           │
           │ Firestore save
           ▼
┌──────────────────────────────────────┐
│         Base Firestore               │
│  user_stories/{id}                   │
│    - dodItems: DoDItem[]             │
└──────┬───────────────────────────────┘
       │
       │ Lecture temps réel (onSnapshot)
       │
       ├─────────────┬──────────────┬─────────────┐
       ▼             ▼              ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Sprint   │  │ Sprint   │  │ Product  │  │  Sprint  │
│ Audit    │  │ actif    │  │ Backlog  │  │ Planning │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
  Édition       Badge         Section       Validation
  complète      résumé        détaillée     pré-clôture
```

## 📍 Points d'intégration

### 1. Sprint Audit (`/sprint-audit`)

**Composant** : `UserStoryDoDFlexible`
**Fonctionnalité** : Édition complète des critères DoD
**Mise à jour** : `handleDoDUpdate(storyId, newDoDItems)`

```typescript
<UserStoryDoDFlexible
  dodItems={story.dodItems}
  onUpdate={(items) => handleDoDUpdate(story.id, items)}
  readOnly={false}
  showPercentage={true}
/>
```

### 2. Sprint actif (`/sprint` tab=board)

**Composant** : `UserStoryDoDFlexibleSummary`
**Fonctionnalité** : Badge résumé coloré par US
**Affichage** : "DoD: 3/6 (50%)" avec code couleur

```typescript
<UserStoryDoDFlexibleSummary dodItems={us.dodItems} />
```

**Couleurs** :
- 🟢 Vert : 100% complet
- 🟡 Jaune : 70-99%
- 🟠 Orange : 40-69%
- 🔴 Rouge : 0-39%

### 3. Product Backlog (`/backlog`)

**Composant** : `UserStoryDoDFlexible` dans `UserStoryCard`
**Fonctionnalité** : Affichage détaillé + édition
**Section** : Bloc "Definition of Done" sous critères d'acceptation

```typescript
{story.dodItems && story.dodItems.length > 0 && (
  <div className="mt-4 p-3 border rounded-lg bg-muted/30">
    <UserStoryDoDFlexible
      dodItems={story.dodItems}
      onUpdate={handleDoDUpdate}
      readOnly={false}
      showPercentage={true}
    />
  </div>
)}
```

### 4. Validation Sprint

**Logique** : `isUserStoryDoDCompleted(userStory)`
**Condition** : `userStory.dodItems?.every(item => item.checked)`
**Usage** : Autoriser clôture de sprint uniquement si toutes les US ont DoD 100%

```typescript
const allUserStoriesHaveDoDCompleted = 
  sprintUserStories.length > 0 &&
  sprintUserStories.every(isUserStoryDoDCompleted);
```

## 🎨 Composants

### `UserStoryDoDFlexible`

**Affichage complet** avec checkboxes éditables

**Props** :
- `dodItems?: DoDItem[]` - Liste des critères
- `onUpdate?: (newItems: DoDItem[]) => void` - Callback mise à jour
- `readOnly?: boolean` - Mode lecture seule
- `showPercentage?: boolean` - Afficher progression

**Features** :
- Barre de progression colorée
- Checkboxes interactives
- Tri par `order`
- Badge résumé "X/Y (Z%)"

### `UserStoryDoDFlexibleSummary`

**Badge résumé** compact

**Props** :
- `dodItems?: DoDItem[]` - Liste des critères

**Affichage** : Badge coloré "DoD: 3/6 (50%)"

## 🔧 Services

### `dodService.ts`

```typescript
// Obtenir les critères par défaut (copie indépendante)
export function getDefaultDoDItems(): DoDItem[]

// Critères par défaut (6 items, tous unchecked)
const DEFAULT_DOD_ITEMS: DoDItem[]
```

### `userStoryService.ts`

```typescript
// Création US avec initialisation automatique dodItems
export async function createUserStory(data: Omit<UserStory, "id" | "code">) {
  const story: UserStory = {
    // ...
    dodItems: getDefaultDoDItems(), // ✅ Auto-init
    // ...
  };
  await setDoc(docRef, story);
}

// Mise à jour dodItems
export const updateUserStory = async (
  id: string,
  story: Partial<UserStory>
)
```

## 📊 Métriques et calculs

### Progression globale Sprint

```typescript
const calculateOverallProgress = () => {
  const totalCriteria = sprintStories.reduce(
    (acc, story) => acc + (story.dodItems?.length || 0),
    0
  );
  
  const completedCriteria = sprintStories.reduce((acc, story) => {
    if (!story.dodItems) return acc;
    return acc + story.dodItems.filter((item) => item.checked).length;
  }, 0);

  const percentage = totalCriteria > 0 
    ? Math.round((completedCriteria / totalCriteria) * 100)
    : 0;

  return { completed: completedCriteria, total: totalCriteria, percentage };
};
```

### US prêtes à clôturer

```typescript
const getReadyForClosureStories = () => {
  return sprintStories.filter((story) => {
    if (!story.dodItems || story.dodItems.length === 0) return false;
    return story.dodItems.every((item) => item.checked);
  });
};
```

## 🔄 Migration des données

### Script de migration

```bash
# Ajouter dodItems à toutes les US existantes
npx tsx scripts/migrate-dod-items.ts
```

### Migration manuelle (Firebase Console)

1. Collection : `user_stories`
2. Document : Sélectionner l'US
3. Ajouter champ `dodItems` (type: array)
4. Ajouter 6 maps avec structure :
   ```
   { id: "1", text: "...", checked: false, order: 0 }
   ```

## ⚠️ Points d'attention

### 1. Rétrocompatibilité

- Anciens composants `UserStoryDoD` et `UserStoryDoDSummary` **préservés**
- Utilisent `dodProgress` (6 booléens fixes)
- Marqués `⚠️ DEPRECATED` dans le code
- À supprimer après migration complète de toutes les US

### 2. Validation avant clôture Sprint

- Vérifier que **toutes les US** ont `dodItems` initialisés
- Ne pas autoriser clôture si une US manque de DoD
- Afficher warning si US sans `dodItems`

### 3. Performance

- `dodItems` stocké directement dans chaque document US
- Pas de collection séparée (évite joins)
- Snapshot temps réel efficace pour synchronisation

## 🎯 Bonnes pratiques

### Initialisation

✅ **Bon** : Utiliser `getDefaultDoDItems()` pour copie fraîche
```typescript
dodItems: getDefaultDoDItems()
```

❌ **Mauvais** : Référencer directement DEFAULT_DOD_ITEMS
```typescript
dodItems: DEFAULT_DOD_ITEMS // ⚠️ Partage même référence !
```

### Mise à jour

✅ **Bon** : Mettre à jour via `updateUserStory()`
```typescript
await updateUserStory(storyId, { dodItems: newDoDItems });
```

❌ **Mauvais** : Modifier directement state sans persistance
```typescript
story.dodItems = newDoDItems; // ⚠️ Perte données !
```

### Vérification

✅ **Bon** : Vérifier existence avant utilisation
```typescript
if (story.dodItems && story.dodItems.length > 0) {
  // Afficher DoD
}
```

❌ **Mauvais** : Assumer présence dodItems
```typescript
story.dodItems.map(...) // ⚠️ Crash si undefined !
```

## 🚀 Évolutions futures

### Critères personnalisables

- Interface admin pour modifier les critères par défaut
- Templates DoD par type de projet (Frontend, Backend, API, etc.)
- Import/export de templates DoD

### Analytics

- Historique validation DoD (qui, quand, quoi)
- Rapport d'audit : % conformité DoD par sprint
- Identification critères souvent non-validés

### Automatisation

- Auto-check critères basés sur events externes :
  - CI/CD success → "Tests automatisés" ✅
  - PR merged → "Code relu" ✅
  - Deploy staging → "Validé en staging" ✅
