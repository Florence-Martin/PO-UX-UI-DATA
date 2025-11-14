# 🛠️ Guide Développeur - PO-UX-UI-DATA

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Installation et configuration](#installation-et-configuration)
4. [Structure du projet](#structure-du-projet)
5. [Développement local](#développement-local)
6. [Tests](#tests)
7. [Déploiement](#déploiement)
8. [Bonnes pratiques](#bonnes-pratiques)
9. [Ressources utiles](#ressources-utiles)

---

## Vue d'ensemble

PO-UX-UI-DATA est une application Next.js complète destinée aux Product Owners spécialisés en UX/UI. Elle intègre les meilleures pratiques agiles, la recherche utilisateur, la gestion de backlog et la visualisation de données.

### Fonctionnalités principales

- **Dashboard UX/Data** : Métriques temps réel et KPIs
- **Roadmap Produit** : Planification trimestrielle
- **Analyse & Wireframes** : Recherche utilisateur, personas, grille wireframes configurable
- **Backlog Product** : Kanban interactif avec drag-and-drop
- **Sprint Management** : Planning et suivi de vélocité
- **Validation & Qualité** : Checklists et tests API

---

## Architecture technique

### Stack principal

```
Frontend : Next.js 14 (App Router) + TypeScript
Styling : TailwindCSS + Shadcn UI
Database : Firebase/Firestore
State : React Context + Custom Hooks
Charts : Chart.js + React-Chartjs-2
Icons : Lucide React
Animation : Framer Motion
```

### Patterns architecturaux

- **Custom Hooks** : Logique métier réutilisable
- **Context API** : Gestion d'état globale
- **Compound Components** : Composants complexes
- **Render Props** : Partage de logique
- **Error Boundaries** : Gestion d'erreurs

### Services métier principaux

#### SprintService (`lib/services/sprintService.ts`)

- `cleanupCompletedSprintsBadges()` : Nettoie les badges des sprints terminés
- `migrateExpiredSprints()` : Migration automatique des sprints expirés
- `debugUserStory(id)` : Debug d'une User Story spécifique
- Gestion du cycle de vie des sprints et badges

#### BacklogTasksService (`lib/services/backlogTasksService.ts`)

- `getAllBacklogTasks()` : Récupère les tâches avec badge "sprint" actif
- `getAllBacklogTasksUnfiltered()` : Récupère toutes les tâches (sans filtre)
- Filtrage automatique par badge pour le Sprint Backlog

#### Pattern de filtrage par badge

```typescript
// Exemple : filtrage des User Stories actives
const activeUserStories = userStories.filter(
  (us) => us.sprintId === currentSprintId && us.badge === "sprint"
);
```

---

## Installation et configuration

### Prérequis

```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git
```

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/Florence-Martin/PO-UX-UI-DATA.git
cd PO-UX-UI-DATA

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Configuration Firebase

1. Créer un projet Firebase
2. Configurer Firestore
3. Ajouter les clés dans `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Structure du projet

```
PO-UX-UI-Data/
├── app/                    # Next.js App Router
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── analysis/          # Module d'analyse
│   ├── backlog/           # Gestion du backlog
│   ├── metrics/           # Métriques et KPIs
│   ├── sprint/            # Sprint management
│   └── validation/        # Tests et validation
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── analysis/         # Composants d'analyse
│   ├── backlog/          # Composants backlog
│   ├── dashboard/        # Composants dashboard
│   └── sprint/           # Composants sprint
├── context/              # Contextes React
│   ├── AuthContext.tsx   # Authentification
│   └── TimelineContext.tsx # Timeline
├── hooks/                # Custom hooks
│   ├── useBacklogTasks.ts
│   ├── usePersonas.ts
│   ├── useRoadmap.ts
│   └── useUserStories.ts
├── lib/                  # Utilitaires et services
│   ├── firebase.ts       # Configuration Firebase
│   ├── utils.ts          # Utilitaires généraux
│   ├── services/         # Services métier
│   ├── types/            # Types TypeScript
│   └── utils/            # Utilitaires spécifiques
├── tests/                # Tests unitaires
├── documentation/        # Documentation projet
└── public/               # Assets statiques
```

---

## Développement local

### Scripts disponibles

```bash
npm run dev             # Développement (http://localhost:3000)
npm run build           # Build de production
npm run start           # Serveur de production
npm run lint            # Vérification ESLint
npm run lint:fix        # Correction automatique ESLint
npm run type-check      # Vérification TypeScript (sans build)
npm run format          # Formater le code avec Prettier
npm run format:check    # Vérifier le formatage (CI)
npm run test            # Lancer les tests
npm run test:watch      # Tests en mode watch
npm run test:coverage   # Tests avec rapport de couverture
npm run clean           # Nettoyer et réinstaller
```

### Configuration VSCode recommandée

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Extensions VSCode utiles

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

---

## Tests

### Configuration Jest

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.?([mc])[jt]s?(x)",
    "**/?(*.)+(spec|test).?([mc])[jt]s?(x)",
    "**/tests/**/*.?([mc])[jt]s?(x)",
  ],
};
```

### Couverture actuelle

- **Tests** : 141 tests passant (100%)
- **Couverture globale** : 100%
- **TypeScript** : Configuration stricte activée
- **Lighthouse Desktop** : Performance 100, Accessibilité 98, Best Practices 96, SEO 100

### Lancer les tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test -- --coverage
```

### Types de tests

```typescript
// Test unitaire basique
describe("progressService", () => {
  it("should calculate progress correctly", () => {
    expect(calculateProgress(5, 10)).toBe(50);
  });
});

// Test avec mock Firebase
jest.mock("@/lib/firebase", () => ({
  db: mockFirestore,
}));

// Test composant React
import { render, screen } from "@testing-library/react";
import Component from "@/components/Component";

test("renders component", () => {
  render(<Component />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

---

## Déploiement

### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Variables d'environnement

```env
# Production
NEXT_PUBLIC_FIREBASE_API_KEY=prod_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod_project

# Development
NEXT_PUBLIC_FIREBASE_API_KEY=dev_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dev_project
```

### Build de production

```bash
npm run build
npm run start
```

---

## Bonnes pratiques

### Code Style

```typescript
// ✅ Bon
const useUserStories = () => {
  const [stories, setStories] = useState<UserStory[]>([]);

  const addStory = useCallback((story: UserStory) => {
    setStories((prev) => [...prev, story]);
  }, []);

  return { stories, addStory };
};

// ❌ Éviter
function getUserStories() {
  let stories = [];
  // logique complexe...
  return stories;
}
```

### Gestion des erreurs

```typescript
// ✅ Avec try/catch et logger
import { logger } from "@/lib/utils/logger";

const fetchData = async () => {
  try {
    const data = await api.getData();
    logger.info("Données récupérées avec succès");
    return data;
  } catch (error) {
    logger.error("Erreur lors de la récupération des données:", error);
    throw new Error("Failed to fetch data");
  }
};
```

### Système de Logging

Le projet utilise un **système de logging centralisé** qui adapte la verbosité selon l'environnement :

#### Utilisation du logger

```typescript
import { logger } from "@/lib/utils/logger";

// Logs d'information (masqués en production)
logger.info("User story créée:", userStory.code);

// Logs de debug (masqués en production)
logger.debug("Payload Firebase:", data);

// Warnings (masqués en production)
logger.warn("Token expiré, rafraîchissement nécessaire");

// Erreurs (toujours visibles)
logger.error("Erreur lors de la sauvegarde:", error);
```

#### Comportement selon l'environnement

| Environnement | info() | debug() | warn() | error() |
|---------------|--------|---------|--------|---------|
| **Development** | ✅ Visible | ✅ Visible | ✅ Visible | ✅ Visible |
| **Production** | ❌ Masqué | ❌ Masqué | ❌ Masqué | ✅ Visible |

#### ⚠️ Ne PAS utiliser `console.log`

```typescript
// ❌ À ÉVITER - Logs visibles en production
console.log("Debug info");
console.error("Error occurred");

// ✅ BON - Logger adaptatif
logger.debug("Debug info");
logger.error("Error occurred");
```

#### Implémentation

Le logger est défini dans `lib/utils/logger.ts` et vérifie `process.env.NODE_ENV` pour adapter la sortie.

```typescript
// lib/utils/logger.ts
const isDevelopment = process.env.NODE_ENV === "development";

class Logger {
  info(message: string, ...args: any[]): void {
    if (!isDevelopment) return; // Masqué en production
    console.info(`[${new Date().toISOString()}] [INFO]`, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${new Date().toISOString()}] [ERROR]`, message, ...args);
  }
}
```

### Types TypeScript

```typescript
// ✅ Types explicites
interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: SprintStatus;
  estimatedPoints: number;
  assignedTo?: string;
}

// ✅ Utilisation des types
const createStory = (data: Partial<UserStory>): UserStory => {
  return {
    id: generateId(),
    status: "todo",
    estimatedPoints: 0,
    ...data,
  } as UserStory;
};
```

### Hooks personnalisés

```typescript
// ✅ Hook réutilisable
const useFirebaseCollection = <T>(
  collectionName: string,
  transformer?: (doc: any) => T
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, collectionName));
        const items = snapshot.docs.map((doc) =>
          transformer ? transformer(doc.data()) : doc.data()
        );
        setData(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
};
```

### Composants

```typescript
// ✅ Composant bien structuré
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}) => {
  const baseClasses = "rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## Ressources utiles

### Documentation officielle

- [Next.js](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Firebase](https://firebase.google.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

### Outils de développement

- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Vercel CLI](https://vercel.com/docs/cli)

### Ressources d'apprentissage

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

---

## 🔧 Dépannage

### Erreurs communes

**Module not found**

```bash
# Vérifier les paths
npm run build
# ou
rm -rf .next node_modules
npm install
```

**Firebase connection issues**

```bash
# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_FIREBASE_API_KEY
```

**Tests qui échouent**

```bash
# Nettoyer le cache Jest
npm test -- --clearCache
```

### Performance

```typescript
// ✅ Optimisations React
const MemoizedComponent = React.memo(MyComponent);

const OptimizedComponent = () => {
  const expensiveValue = useMemo(() => heavyCalculation(data), [data]);

  const handleClick = useCallback(() => {
    // handle click
  }, [dependency]);

  return <div>{expensiveValue}</div>;
};
```

---

**Auteur** : Florence Martin - PO / UX/UI / Frontend Developer  
**Dernière mise à jour** : Septembre 2025  
**Version** : 1.0.0
