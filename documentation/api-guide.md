# 📡 Guide API - PO-UX-UI-DATA

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration Firebase](#configuration-firebase)
3. [Services disponibles](#services-disponibles)
4. [Hooks personnalisés](#hooks-personnalisés)
5. [Types et interfaces](#types-et-interfaces)
6. [Gestion des erreurs](#gestion-des-erreurs)
7. [Exemples d'utilisation](#exemples-dutilisation)

---

## 🎯 Vue d'ensemble

Cette documentation détaille l'API interne de l'application PO-UX-UI-DATA, incluant les services Firebase, les hooks personnalisés et les types TypeScript.

### Architecture API
```
lib/
├── services/           # Services métier
│   ├── progressService.ts
│   ├── userStoryService.ts
│   └── sprintService.ts
├── utils/             # Utilitaires
│   ├── buildTimelineItemsUserStories.ts
│   └── dateUtils.ts
├── types/             # Types TypeScript
│   ├── userStory.ts
│   ├── sprint.ts
│   └── backlogTask.ts
└── firebase.ts        # Configuration Firebase
```

---

## 🔧 Configuration Firebase

### Initialisation
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Collections Firestore
```typescript
// Collections disponibles
const COLLECTIONS = {
  USER_STORIES: 'userStories',
  SPRINTS: 'sprints',
  BACKLOG_TASKS: 'backlogTasks',
  PERSONAS: 'personas',
  WIREFRAMES: 'wireframes',
  METRICS: 'metrics',
} as const;
```

---

## 🛠️ Services disponibles

### ProgressService

Service pour calculer la progression des wireframes et autres métriques.

```typescript
// lib/services/progressService.ts

/**
 * Calcule la progression des wireframes
 * @param wireframes - Liste des wireframes
 * @returns Pourcentage de progression (0-100)
 */
export const calculateWireframeProgress = (
  wireframes: Wireframe[]
): number => {
  if (wireframes.length === 0) return 0;
  
  const completed = wireframes.filter(w => w.status === 'completed').length;
  return Math.round((completed / wireframes.length) * 100);
};

/**
 * Calcule la progression globale du projet
 * @param sections - Sections du projet avec leur progression
 * @returns Progression globale (0-100)
 */
export const calculateOverallProgress = (
  sections: ProjectSection[]
): number => {
  if (sections.length === 0) return 0;
  
  const totalProgress = sections.reduce((sum, section) => {
    return sum + (section.progress * section.weight);
  }, 0);
  
  const totalWeight = sections.reduce((sum, section) => {
    return sum + section.weight;
  }, 0);
  
  return Math.round(totalProgress / totalWeight);
};
```

### UserStoryService

Service pour gérer les user stories.

```typescript
// lib/services/userStoryService.ts

/**
 * Récupère toutes les user stories depuis Firestore
 * @returns Promise<UserStory[]>
 */
export const getUserStories = async (): Promise<UserStory[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.USER_STORIES));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserStory[];
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw new Error('Failed to fetch user stories');
  }
};

/**
 * Ajoute une nouvelle user story
 * @param story - Données de la user story (sans ID)
 * @returns Promise<string> - ID de la story créée
 */
export const addUserStory = async (
  story: Omit<UserStory, 'id'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USER_STORIES), {
      ...story,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding user story:', error);
    throw new Error('Failed to add user story');
  }
};

/**
 * Met à jour une user story existante
 * @param id - ID de la story
 * @param updates - Mises à jour à appliquer
 * @returns Promise<void>
 */
export const updateUserStory = async (
  id: string,
  updates: Partial<UserStory>
): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USER_STORIES, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user story:', error);
    throw new Error('Failed to update user story');
  }
};

/**
 * Supprime une user story
 * @param id - ID de la story à supprimer
 * @returns Promise<void>
 */
export const deleteUserStory = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USER_STORIES, id));
  } catch (error) {
    console.error('Error deleting user story:', error);
    throw new Error('Failed to delete user story');
  }
};
```

### SprintService

Service pour gérer les sprints.

```typescript
// lib/services/sprintService.ts

/**
 * Calcule la vélocité d'un sprint
 * @param stories - User stories du sprint
 * @returns Vélocité (points terminés)
 */
export const calculateSprintVelocity = (stories: UserStory[]): number => {
  return stories
    .filter(story => story.status === 'done')
    .reduce((sum, story) => sum + story.estimatedPoints, 0);
};

/**
 * Calcule les statistiques d'un sprint
 * @param sprint - Sprint à analyser
 * @returns Statistiques du sprint
 */
export const calculateSprintStats = (sprint: Sprint): SprintStats => {
  const totalStories = sprint.stories.length;
  const completedStories = sprint.stories.filter(s => s.status === 'done').length;
  const totalPoints = sprint.stories.reduce((sum, s) => sum + s.estimatedPoints, 0);
  const completedPoints = sprint.stories
    .filter(s => s.status === 'done')
    .reduce((sum, s) => sum + s.estimatedPoints, 0);

  return {
    totalStories,
    completedStories,
    totalPoints,
    completedPoints,
    completionRate: totalStories > 0 ? (completedStories / totalStories) * 100 : 0,
    velocity: completedPoints,
    averagePointsPerStory: totalStories > 0 ? totalPoints / totalStories : 0,
  };
};
```

---

## 🪝 Hooks personnalisés

### useUserStories

Hook pour gérer les user stories.

```typescript
// hooks/useUserStories.ts

interface UseUserStoriesReturn {
  stories: UserStory[];
  loading: boolean;
  error: string | null;
  addStory: (story: Omit<UserStory, 'id'>) => Promise<void>;
  updateStory: (id: string, updates: Partial<UserStory>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUserStories = (): UseUserStoriesReturn => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserStories();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addStory = useCallback(async (story: Omit<UserStory, 'id'>) => {
    try {
      const id = await addUserStory(story);
      const newStory: UserStory = { ...story, id };
      setStories(prev => [...prev, newStory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add story');
    }
  }, []);

  const updateStory = useCallback(async (id: string, updates: Partial<UserStory>) => {
    try {
      await updateUserStory(id, updates);
      setStories(prev =>
        prev.map(story =>
          story.id === id ? { ...story, ...updates } : story
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update story');
    }
  }, []);

  const deleteStory = useCallback(async (id: string) => {
    try {
      await deleteUserStory(id);
      setStories(prev => prev.filter(story => story.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return {
    stories,
    loading,
    error,
    addStory,
    updateStory,
    deleteStory,
    refetch: fetchStories,
  };
};
```

### useBacklogTasks

Hook pour gérer les tâches du backlog.

```typescript
// hooks/useBacklogTasks.ts

interface UseBacklogTasksReturn {
  tasks: BacklogTask[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<BacklogTask, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<BacklogTask>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => BacklogTask[];
  getTasksByPriority: (priority: Priority) => BacklogTask[];
}

export const useBacklogTasks = (): UseBacklogTasksReturn => {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Implémentation similaire à useUserStories...

  const getTasksByStatus = useCallback((status: TaskStatus): BacklogTask[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTasksByPriority = useCallback((priority: Priority): BacklogTask[] => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  }, [updateTask]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus,
    getTasksByPriority,
  };
};
```

### useRoadmap

Hook pour gérer la roadmap produit.

```typescript
// hooks/useRoadmap.ts

interface UseRoadmapReturn {
  roadmap: RoadmapQuarter[];
  loading: boolean;
  error: string | null;
  addQuarter: (quarter: Omit<RoadmapQuarter, 'id'>) => Promise<void>;
  updateQuarter: (id: string, updates: Partial<RoadmapQuarter>) => Promise<void>;
  addObjective: (quarterId: string, objective: Omit<Objective, 'id'>) => Promise<void>;
  updateObjective: (quarterId: string, objectiveId: string, updates: Partial<Objective>) => Promise<void>;
  deleteObjective: (quarterId: string, objectiveId: string) => Promise<void>;
}

export const useRoadmap = (): UseRoadmapReturn => {
  // Implémentation pour la gestion de la roadmap...
};
```

---

## 📋 Types et interfaces

### Types principaux

```typescript
// lib/types/userStory.ts
export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: Priority;
  status: SprintStatus;
  estimatedPoints: number;
  assignedTo?: string;
  sprintId?: string;
  epicId?: string;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

// lib/types/sprint.ts
export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  stories: UserStory[];
  capacity: number;
  velocity: number;
  burndownData: BurndownPoint[];
  createdAt: Date;
  updatedAt: Date;
}

// lib/types/backlogTask.ts
export interface BacklogTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  status: TaskStatus;
  estimatedHours: number;
  actualHours?: number;
  assignedTo?: string;
  dueDate?: Date;
  dependencies: string[];
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Types énumérés
export type Priority = 'high' | 'medium' | 'low';
export type SprintStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type TaskStatus = 'todo' | 'in-progress' | 'in-testing' | 'done';
export type TaskType = 'feature' | 'bug' | 'technical' | 'documentation';
```

### Types utilitaires

```typescript
// lib/types/common.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
```

---

## 🚨 Gestion des erreurs

### Classes d'erreur personnalisées

```typescript
// lib/utils/errors.ts

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string) {
    super(`Database error: ${message}`, 500);
  }
}
```

### Gestionnaire d'erreurs

```typescript
// lib/utils/errorHandler.ts

export const handleApiError = (error: unknown): ApiError => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleApiError(error);
    }
  };
};
```

---

## 📚 Exemples d'utilisation

### Utilisation des hooks

```typescript
// components/UserStoryList.tsx
import { useUserStories } from '@/hooks/useUserStories';

const UserStoryList: React.FC = () => {
  const { stories, loading, error, addStory, updateStory, deleteStory } = useUserStories();

  const handleAddStory = async () => {
    await addStory({
      title: 'New User Story',
      description: 'Story description',
      acceptanceCriteria: ['Criteria 1', 'Criteria 2'],
      priority: 'medium',
      status: 'todo',
      estimatedPoints: 5,
      labels: ['backend'],
    });
  };

  const handleUpdateStory = async (id: string) => {
    await updateStory(id, {
      status: 'in-progress',
      assignedTo: 'developer@example.com',
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleAddStory}>Add Story</button>
      {stories.map(story => (
        <div key={story.id}>
          <h3>{story.title}</h3>
          <p>{story.description}</p>
          <button onClick={() => handleUpdateStory(story.id)}>
            Update Status
          </button>
          <button onClick={() => deleteStory(story.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Utilisation des services

```typescript
// components/SprintDashboard.tsx
import { calculateSprintStats } from '@/lib/services/sprintService';

const SprintDashboard: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
  const stats = calculateSprintStats(sprint);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="stat-card">
        <h3>Completion Rate</h3>
        <p>{stats.completionRate.toFixed(1)}%</p>
      </div>
      <div className="stat-card">
        <h3>Velocity</h3>
        <p>{stats.velocity} points</p>
      </div>
      <div className="stat-card">
        <h3>Stories Completed</h3>
        <p>{stats.completedStories} / {stats.totalStories}</p>
      </div>
      <div className="stat-card">
        <h3>Points Completed</h3>
        <p>{stats.completedPoints} / {stats.totalPoints}</p>
      </div>
    </div>
  );
};
```

### Utilisation avec gestion d'erreurs

```typescript
// components/TaskManager.tsx
import { useBacklogTasks } from '@/hooks/useBacklogTasks';
import { handleApiError } from '@/lib/utils/errorHandler';

const TaskManager: React.FC = () => {
  const { tasks, updateTaskStatus } = useBacklogTasks();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setActionError(null);
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      const apiError = handleApiError(error);
      setActionError(apiError.message);
    }
  };

  return (
    <div>
      {actionError && (
        <div className="error-banner">
          {actionError}
        </div>
      )}
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};
```

---

## 🔍 Debugging et monitoring

### Logs utiles

```typescript
// lib/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
```

### Performance monitoring

```typescript
// lib/utils/performance.ts
export const withPerformanceTracking = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  functionName: string
) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      logger.debug(`${functionName} executed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`${functionName} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };
};
```

---

**Auteur** : Florence Martin - PO / UX/UI / Frontend Developer  
**Dernière mise à jour** : Janvier 2025  
**Version** : 1.0.0
