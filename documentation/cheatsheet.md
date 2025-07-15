# 🚀 Cheatsheet Développeur - PO-UX-UI-DATA

## ⚡ Commandes rapides

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build
npm run start

# Tests
npm run test              # Tous les tests
npm run test:watch        # Mode watch
npm test -- --coverage   # Avec couverture

# Linting
npm run lint
npm run lint -- --fix    # Avec correction automatique

# Nettoyage
npm run clean            # Nettoie et réinstalle
```

### Git workflow

```bash
# Nouvelle feature
git checkout -b feature/nom-feature
git add .
git commit -m "feat(scope): description"
git push origin feature/nom-feature

# Hotfix
git checkout -b hotfix/nom-bug
git commit -m "fix(scope): correction"
```

---

## 📁 Structure clé

```
app/                    # Pages Next.js
├── analysis/          # Module d'analyse
├── backlog/           # Gestion backlog
├── sprint/            # Sprint management
└── validation/        # Tests et validation

components/            # Composants réutilisables
├── ui/               # Composants de base
├── analysis/         # Composants d'analyse
├── backlog/          # Composants backlog
└── dashboard/        # Composants dashboard

hooks/                # Hooks personnalisés
├── useUserStories.ts
├── useBacklogTasks.ts
└── useRoadmap.ts

lib/                  # Services et utilitaires
├── services/         # Services métier
├── types/            # Types TypeScript
├── utils/            # Utilitaires
└── firebase.ts       # Configuration Firebase

tests/                # Tests unitaires
```

---

## 🎯 Hooks principaux

### useUserStories

```typescript
const { stories, loading, error, addStory, updateStory, deleteStory } =
  useUserStories();
```

### useBacklogTasks

```typescript
const { tasks, loading, error, addTask, updateTask, getTasksByStatus } =
  useBacklogTasks();
```

### useRoadmap

```typescript
const { roadmap, loading, error, addQuarter, updateQuarter, addObjective } =
  useRoadmap();
```

---

## 🏗️ Types essentiels

### UserStory

```typescript
interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "done";
  estimatedPoints: number;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BacklogTask

```typescript
interface BacklogTask {
  id: string;
  title: string;
  description: string;
  type: "feature" | "bug" | "technical";
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "done";
  estimatedHours: number;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎨 Composants UI

### Shadcn UI

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
```

### Composants personnalisés

```typescript
import { UserStoryCard } from "@/components/backlog/UserStoryCard";
import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { SprintCard } from "@/components/sprint/SprintCard";
import { RoadmapCard } from "@/components/analysis/RoadmapCard";
```

---

## 🔧 Services utiles

### progressService

```typescript
import {
  calculateWireframeProgress,
  calculateOverallProgress,
} from "@/lib/services/progressService";
```

### userStoryService

```typescript
import {
  getUserStories,
  addUserStory,
  updateUserStory,
  deleteUserStory,
} from "@/lib/services/userStoryService";
```

### sprintService

```typescript
import {
  calculateSprintVelocity,
  calculateSprintStats,
} from "@/lib/services/sprintService";
```

---

## 🧪 Tests patterns

### Test unitaire

```typescript
describe("Component", () => {
  it("should render correctly", () => {
    render(<Component />);
    expect(screen.getByText("Text")).toBeInTheDocument();
  });
});
```

### Test hook

```typescript
describe("useHook", () => {
  it("should return initial state", () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.loading).toBe(true);
  });
});
```

### Test avec mock

```typescript
jest.mock("@/lib/firebase", () => ({
  db: mockFirestore,
}));
```

---

## 📡 Firebase

### Configuration

```typescript
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
```

### CRUD operations

```typescript
// Create
const docRef = await addDoc(collection(db, "collection"), data);

// Read
const snapshot = await getDocs(collection(db, "collection"));

// Update
await updateDoc(doc(db, "collection", id), updates);

// Delete
await deleteDoc(doc(db, "collection", id));
```

---

## 🎨 Styling

### TailwindCSS classes communes

```css
/* Layout */
.container {
  @apply mx-auto px-4 py-8;
}
.grid-cols-auto {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
.flex-center {
  @apply flex items-center justify-center;
}

/* Composants */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}
.button {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
.input {
  @apply w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2;
}
```

### Thèmes

```typescript
// Utilisation du thème
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
```

---

## 🔍 Debugging

### React DevTools

- Components tab pour inspecter l'état
- Profiler pour les performances
- Console pour les erreurs

### Console logs utiles

```typescript
console.log("State:", { stories, loading, error });
console.table(stories);
console.time("operation");
// ... opération
console.timeEnd("operation");
```

### Erreurs communes

```typescript
// TypeError: Cannot read property 'x' of undefined
const safeProp = object?.property || defaultValue;

// React Hook useEffect has a missing dependency
useEffect(() => {
  // code
}, [dependency]); // Ajouter la dépendance

// Firebase permission-denied
// Vérifier les règles Firestore
```

---

## 🚀 Performance

### Optimisations React

```typescript
// Mémorisation
const MemoizedComponent = React.memo(Component);

// useMemo pour les calculs coûteux
const expensiveValue = useMemo(() => heavyCalculation(data), [data]);

// useCallback pour les fonctions
const handleClick = useCallback(() => {
  // handle click
}, [dependency]);
```

### Optimisations Next.js

```typescript
// Dynamic imports
const Component = dynamic(() => import("./Component"), {
  loading: () => <div>Loading...</div>,
});

// Image optimization
import Image from "next/image";
<Image src="/image.jpg" alt="Description" width={500} height={300} />;
```

---

## 📚 Ressources rapides

### Documentation

- [Guide développeur](./documentation/developer-guide.md)
- [Guide API](./documentation/api-guide.md)
- [Contribution](./documentation/contributing.md)

### Liens externes

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

---

## 🔥 Raccourcis VSCode

```
Ctrl+` : Terminal
Ctrl+Shift+P : Palette de commandes
Ctrl+P : Recherche de fichiers
Ctrl+D : Sélection multiple
Ctrl+Shift+L : Sélectionner toutes les occurrences
F2 : Renommer
Ctrl+/ : Commenter/décommenter
```

---

**💡 Tip** : Gardez cette cheatsheet à portée de main pour un développement plus rapide !

---

**Auteur** : Florence Martin - PO / UX/UI / Frontend Developer  
**Dernière mise à jour** : Janvier 2025
