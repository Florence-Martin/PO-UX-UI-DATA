# 🤝 Guide de Contribution - PO-UX-UI-DATA

## 📋 Table des Matières

1. [Processus de contribution](#processus-de-contribution)
2. [Standards de code](#standards-de-code)
3. [Conventions Git](#conventions-git)
4. [Tests et qualité](#tests-et-qualité)
5. [Documentation](#documentation)
6. [Workflow de développement](#workflow-de-développement)

---

## Processus de contribution

### 1. Avant de commencer

- [ ] Lire ce guide de contribution
- [ ] Consulter les [issues existantes](https://github.com/Florence-Martin/PO-UX-UI-DATA/issues)
- [ ] Discuter des changements importants via une issue

### 2. Setup de développement

```bash
# Fork le repository
git clone https://github.com/[username]/PO-UX-UI-DATA.git
cd PO-UX-UI-DATA

# Installer les dépendances
npm install

# Créer une branche pour votre feature
git checkout -b feature/nom-de-votre-feature

# Lancer l'environnement de développement
npm run dev
```

### 3. Processus de développement

- [ ] Écrire du code propre et testé
- [ ] Respecter les conventions de nommage
- [ ] Ajouter des tests pour les nouvelles fonctionnalités
- [ ] Mettre à jour la documentation si nécessaire
- [ ] Tester localement avant de push

### 4. Soumission

- [ ] Créer une Pull Request
- [ ] Remplir le template de PR
- [ ] Lier les issues correspondantes
- [ ] Attendre les reviews

---

## Standards de code

### Structure des fichiers

```
component/
├── index.ts                    # Export principal
├── Component.tsx               # Composant principal
├── Component.test.tsx          # Tests unitaires
├── Component.stories.tsx       # Stories (si applicable)
├── hooks/
│   ├── useComponentLogic.ts    # Logique métier
│   └── useComponentLogic.test.ts # Tests du hook
└── types.ts                    # Types TypeScript
```

### Conventions de nommage

#### Fichiers

```
PascalCase     → Components, Types, Interfaces
camelCase      → hooks, utils, functions
kebab-case     → pages, dossiers
UPPER_CASE     → constantes, enums
```

#### Variables et fonctions

```typescript
// ✅ Bon
const userStories = [];
const fetchUserStories = async () => {};
const USER_STORY_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

// ❌ Éviter
const UserStories = [];
const FetchUserStories = async () => {};
const userStoryStatus = {
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
};
```

#### Composants

```typescript
// ✅ Bon
interface UserStoryCardProps {
  story: UserStory;
  onUpdate: (story: UserStory) => void;
  className?: string;
}

const UserStoryCard: React.FC<UserStoryCardProps> = ({
  story,
  onUpdate,
  className = "",
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3>{story.title}</h3>
      <p>{story.description}</p>
    </div>
  );
};

export default UserStoryCard;
```

### Types TypeScript

```typescript
// ✅ Interfaces pour les objets
interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: SprintStatus;
  estimatedPoints: number;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Types pour les unions
type Priority = "high" | "medium" | "low";
type SprintStatus = "todo" | "in-progress" | "in-review" | "done";

// ✅ Énumérations pour les constantes
enum UserRole {
  ADMIN = "admin",
  PRODUCT_OWNER = "product_owner",
  DEVELOPER = "developer",
  DESIGNER = "designer",
}
```

### Hooks personnalisés

```typescript
// ✅ Structure type pour un hook
const useUserStories = () => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonctions de manipulation
  const addStory = useCallback((story: Omit<UserStory, "id">) => {
    const newStory: UserStory = {
      ...story,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStories((prev) => [...prev, newStory]);
  }, []);

  const updateStory = useCallback((id: string, updates: Partial<UserStory>) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === id
          ? { ...story, ...updates, updatedAt: new Date() }
          : story
      )
    );
  }, []);

  const deleteStory = useCallback((id: string) => {
    setStories((prev) => prev.filter((story) => story.id !== id));
  }, []);

  // Effet pour charger les données
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getUserStoriesFromDB();
        setStories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    addStory,
    updateStory,
    deleteStory,
  };
};
```

---

## Conventions Git

### Branches

```
main                    # Production
develop                 # Développement
feature/feature-name    # Nouvelles fonctionnalités
bugfix/bug-name         # Corrections de bugs
hotfix/urgent-fix       # Corrections urgentes
release/v1.0.0          # Préparation de release
```

### Messages de commit

Format : `type(scope): description`

```
feat(backlog): add drag and drop functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button spacing
refactor(hooks): extract common logic to useAPI
test(utils): add tests for date formatting
chore(deps): update dependencies
```

#### Types de commit

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Mise en forme (pas de changement logique)
- `refactor`: Refactorisation
- `test`: Ajout/modification de tests
- `chore`: Maintenance (deps, config, etc.)

#### Exemples

```bash
# ✅ Bon
git commit -m "feat(dashboard): add real-time metrics chart"
git commit -m "fix(sprint): resolve drag and drop performance issue"
git commit -m "test(utils): add edge cases for timeline builder"

# ❌ Éviter
git commit -m "update stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## Tests et qualité

### Standards de test

```typescript
// ✅ Structure de test
describe("UserStoryCard", () => {
  const mockStory: UserStory = {
    id: "1",
    title: "Test Story",
    description: "Test description",
    priority: "high",
    status: "todo",
    estimatedPoints: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should render story title and description", () => {
    render(<UserStoryCard story={mockStory} onUpdate={jest.fn()} />);

    expect(screen.getByText("Test Story")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should call onUpdate when story is modified", () => {
    const mockUpdate = jest.fn();
    render(<UserStoryCard story={mockStory} onUpdate={mockUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(mockUpdate).toHaveBeenCalledWith(mockStory);
  });
});
```

### Couverture de code

- **Minimum requis** : 80% statements, 70% branches
- **Objectif** : 90% statements, 80% branches
- **Obligatoire** : 100% functions

```bash
# Lancer les tests avec couverture
npm run test -- --coverage

# Vérifier la couverture avant commit
npm run test -- --coverage --watchAll=false
```

### Types de tests

#### Tests unitaires

```typescript
// Test de fonction pure
describe("calculateProgress", () => {
  it("should return 0 for no completed items", () => {
    expect(calculateProgress(0, 10)).toBe(0);
  });

  it("should return 100 for all completed items", () => {
    expect(calculateProgress(10, 10)).toBe(100);
  });

  it("should handle edge case with 0 total items", () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });
});
```

#### Tests d'hooks

```typescript
// Test de hook personnalisé
describe("useUserStories", () => {
  it("should initialize with empty stories", () => {
    const { result } = renderHook(() => useUserStories());

    expect(result.current.stories).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should add story correctly", () => {
    const { result } = renderHook(() => useUserStories());

    act(() => {
      result.current.addStory({
        title: "New Story",
        description: "Description",
        priority: "high",
        status: "todo",
        estimatedPoints: 3,
      });
    });

    expect(result.current.stories).toHaveLength(1);
    expect(result.current.stories[0].title).toBe("New Story");
  });
});
```

---

## Documentation

### Code documentation

```typescript
/**
 * Hook pour gérer les user stories du backlog
 *
 * @returns {Object} Objet contenant les stories et les méthodes de manipulation
 * @example
 * const { stories, addStory, updateStory } = useUserStories();
 */
const useUserStories = () => {
  // Implementation...
};

/**
 * Calcule le pourcentage de progression
 *
 * @param completed - Nombre d'éléments terminés
 * @param total - Nombre total d'éléments
 * @returns Pourcentage de progression (0-100)
 */
const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
```

### README des composants

````markdown
# UserStoryCard

Composant pour afficher une user story dans le backlog.

## Props

| Prop      | Type                       | Required | Description                 |
| --------- | -------------------------- | -------- | --------------------------- |
| story     | UserStory                  | ✅       | Objet user story            |
| onUpdate  | (story: UserStory) => void | ✅       | Callback mise à jour        |
| className | string                     | ❌       | Classes CSS supplémentaires |

## Exemple d'utilisation

```tsx
<UserStoryCard
  story={userStory}
  onUpdate={handleUpdateStory}
  className="mb-4"
/>
```
````

## Tests

- [x] Affichage des données
- [x] Interaction utilisateur
- [x] Gestion des erreurs

---

## Workflow de développement

### 1. Planification

- [ ] Créer/choisir une issue
- [ ] Définir les critères d'acceptation
- [ ] Estimer la complexité

### 2. Développement

```bash
# Créer une branche
git checkout -b feature/user-story-drag-drop

# Développer la fonctionnalité
# - Écrire les tests
# - Implémenter la logique
# - Vérifier la qualité

# Tester localement
npm run test
npm run lint
npm run build
```

### 3. Review et merge

```bash
# Push des changements
git push origin feature/user-story-drag-drop

# Créer une Pull Request
# - Titre explicite
# - Description détaillée
# - Screenshots/GIFs si UI
# - Lien vers l'issue

# Après review et approbation
git checkout main
git pull origin main
git branch -d feature/user-story-drag-drop
```

### 4. Template de Pull Request

```markdown
## Description

Brève description des changements apportés.

## Type de changement

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Couverture de code maintenue

## Checklist

- [ ] Code respecte les conventions
- [ ] Documentation mise à jour
- [ ] Tests passent
- [ ] Build réussit
- [ ] Pas de régression

## Screenshots

[Si applicable]

## Notes supplémentaires

[Informations complémentaires]
```

---

## Standards de qualité

### Critères d'acceptation

- [ ] Code fonctionne correctement
- [ ] Tests passent (100%)
- [ ] Couverture de code maintenue
- [ ] Documentation à jour
- [ ] Pas de régression
- [ ] Performance acceptable
- [ ] Accessibilité respectée

### Checklist avant merge

- [ ] Lint sans erreur
- [ ] Build sans erreur
- [ ] Tests unitaires passent
- [ ] Review approuvée
- [ ] Conflicts résolus
- [ ] Changelog mis à jour (si nécessaire)

---

## 📞 Support et questions

### Où obtenir de l'aide

- **Issues GitHub** : Pour les bugs et feature requests
- **LinkedIn** : [Florence Martin](https://www.linkedin.com/in/florence-martin-922b3861/)
- **Email** : [Contact direct]

### Ressources utiles

- [Documentation développeur](./developer-guide.md)
- [Règles métier](./business-rules.md)
- [Roadmap technique](./roadmap-development.md)

---

**Merci de contribuer à PO-UX-UI-DATA ! 🚀**

---

**Auteur** : Florence Martin - PO / UX/UI / Frontend Developer  
**Dernière mise à jour** : Janvier 2025  
**Version** : 1.0.0
