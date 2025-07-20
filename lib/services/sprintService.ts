import { db } from "@/lib/firebase";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const sprintCollection = collection(db, "sprints");

// Validation des entrées de sprint
//  Vérifier que le titre du sprint est valide et que les dates sont correctes
export const validateSprintInput = (
  data: Partial<Sprint>,
  { requireTitle = true }: { requireTitle?: boolean } = {}
) => {
  if (
    (requireTitle || data.title !== undefined) &&
    (!data.title || data.title.trim().length < 3)
  ) {
    throw new Error(
      "Sprint title is required and must be at least 3 characters long."
    );
  }
  if (data.startDate !== undefined && data.endDate !== undefined) {
    const start =
      data.startDate instanceof Date ? data.startDate : data.startDate.toDate();
    const end =
      data.endDate instanceof Date ? data.endDate : data.endDate.toDate();
    if (start > end) {
      throw new Error("Start date must be before end date.");
    }
  }
};

//  Créer un sprint
export const createSprint = async (
  data: Omit<Sprint, "id" | "progress" | "status">
) => {
  validateSprintInput(data);
  const docRef = await addDoc(sprintCollection, {
    ...data,
    progress: 0,
    status: "planned",
    startDate:
      data.startDate instanceof Date
        ? Timestamp.fromDate(data.startDate)
        : data.startDate,
    endDate:
      data.endDate instanceof Date
        ? Timestamp.fromDate(data.endDate)
        : data.endDate,
  });
  return docRef.id;
};

//  Récupérer tous les sprints
export const getAllSprints = async (): Promise<Sprint[]> => {
  const snapshot = await getDocs(sprintCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Sprint, "id">),
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate(),
  }));
};

//  Récupérer un sprint par ID
export const getSprintById = async (id: string): Promise<Sprint | null> => {
  const docRef = doc(sprintCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id,
      ...(docSnap.data() as Omit<Sprint, "id">),
      startDate: docSnap.data().startDate.toDate(),
      endDate: docSnap.data().endDate.toDate(),
    };
  }
  return null;
};

//  Mettre à jour un sprint
export const updateSprint = async (
  id: string,
  data: Partial<Omit<Sprint, "id">>
) => {
  validateSprintInput(data, { requireTitle: false }); // titre optionnel
  const docRef = doc(sprintCollection, id);
  await updateDoc(docRef, {
    ...data,
    ...(data.startDate && {
      startDate:
        data.startDate instanceof Date
          ? Timestamp.fromDate(data.startDate)
          : data.startDate,
    }),
    ...(data.endDate && {
      endDate:
        data.endDate instanceof Date
          ? Timestamp.fromDate(data.endDate)
          : data.endDate,
    }),
  });
};

//  Clôturer un sprint (passer en "done")
//  Clôturer un sprint (avec gestion optionnelle des US/Tasks)
export const closeSprint = async (
  sprintId: string,
  options: {
    shouldHandleIncompleteUserStories?: boolean;
    shouldHandleIncompleteTasks?: boolean;
    userStories?: UserStory[];
    tasks?: BacklogTask[];
  } = {}
) => {
  const {
    shouldHandleIncompleteUserStories = false,
    shouldHandleIncompleteTasks = false,
    userStories = [],
    tasks = [],
  } = options;

  // Gérer les User Stories incompatibles si demandé
  if (shouldHandleIncompleteUserStories && userStories.length > 0) {
    await handleIncompleteUserStories(sprintId, userStories, "backlog");
  }

  // Gérer les Tasks incompatibles si demandé
  if (shouldHandleIncompleteTasks && tasks.length > 0) {
    await handleIncompleteTasks(sprintId, tasks, userStories, "backlog");
  }

  // Clôturer le sprint
  const docRef = doc(sprintCollection, sprintId);
  await updateDoc(docRef, {
    status: "done",
    closedAt: Timestamp.now(),
    progress: 100, // Sprint terminé
    hasReview: true, // Review obligatoire pour clôturer
    hasRetrospective: true, // Retrospective obligatoire pour clôturer
  });
};

//  Vérifier si une User Story a sa DoD complétée
const isUserStoryCompleted = (userStory: UserStory): boolean => {
  if (!userStory.dodProgress) return false;
  return Object.values(userStory.dodProgress).every(Boolean);
};

//  Vérifier si une Task est terminée
const isTaskCompleted = (task: BacklogTask): boolean => {
  return task.status === "done";
};

//  Gérer les Tasks non terminées lors de la clôture d'un sprint
export const handleIncompleteTasks = async (
  sprintId: string,
  tasks: BacklogTask[],
  userStories: UserStory[],
  strategy: "backlog" | "nextSprint" = "backlog"
): Promise<{ moved: number; completed: number }> => {
  // Identifier les Tasks liées au sprint via les User Stories du sprint
  const sprintUserStoryIds = userStories
    .filter((story) => story.sprintId === sprintId)
    .map((story) => story.id);

  const sprintTasks = tasks.filter((task) =>
    task.userStoryIds?.some((usId) => sprintUserStoryIds.includes(usId))
  );

  const completed = sprintTasks.filter(isTaskCompleted);
  const incomplete = sprintTasks.filter((task) => !isTaskCompleted(task));

  // Gérer TOUTES les tasks du sprint (terminées ET incomplètes)
  // pour qu'elles ne polluent plus le Sprint Backlog actif
  if (sprintTasks.length > 0) {
    console.log(
      `📝 ${sprintTasks.length} Tasks trouvées dans le sprint (${completed.length} terminées, ${incomplete.length} incomplètes)`
    );

    // Mettre à jour TOUTES les Tasks du sprint selon la stratégie
    const taskCollection = collection(db, "backlog_tasks");
    const updates = sprintTasks.map(async (task) => {
      const taskRef = doc(taskCollection, task.id!);

      if (strategy === "backlog") {
        // Retirer le badge "sprint" pour toutes les tasks du sprint clôturé
        // Elles seront visibles uniquement via la vue historique du sprint
        await updateDoc(taskRef, {
          badge: null, // Plus de badge "sprint"
        });

        const status = isTaskCompleted(task) ? "terminée" : "incomplète";
        console.log(
          `  📝 Task "${task.title}" (${status}) archivée (badge retiré)`
        );
      } else {
        // Logique pour reporter au sprint suivant
        console.log(`  ➡️ Task "${task.title}" à reporter au sprint suivant`);
      }
    });

    await Promise.all(updates);
  }

  return {
    moved: sprintTasks.length, // Toutes les tasks sont "déplacées" (archivées)
    completed: completed.length,
  };
};

//  Gérer les User Stories non terminées lors de la clôture d'un sprint
export const handleIncompleteUserStories = async (
  sprintId: string,
  userStories: UserStory[],
  strategy: "backlog" | "nextSprint" = "backlog"
): Promise<{ moved: number; completed: number }> => {
  const sprintUserStories = userStories.filter(
    (story) => story.sprintId === sprintId
  );

  const completed = sprintUserStories.filter(isUserStoryCompleted);
  const incomplete = sprintUserStories.filter(
    (story) => !isUserStoryCompleted(story)
  );

  if (incomplete.length > 0) {
    console.log(
      `📋 ${incomplete.length} User Stories non terminées trouvées dans le sprint`
    );

    // Mettre à jour les US non terminées selon la stratégie
    const userStoryCollection = collection(db, "userStories");
    const updates = incomplete.map(async (story) => {
      const storyRef = doc(userStoryCollection, story.id);

      if (strategy === "backlog") {
        // Remettre dans le backlog (retirer sprintId)
        await updateDoc(storyRef, {
          sprintId: null,
          badge: null,
        });
        console.log(`📤 [${story.code}] reportée au backlog`);
      } else {
        // Logique pour reporter au sprint suivant (à implémenter si nécessaire)
        console.log(`➡️ [${story.code}] à reporter au sprint suivant`);
      }
    });

    await Promise.all(updates);
  }

  return {
    moved: incomplete.length,
    completed: completed.length,
  };
};

//  Migration : Clôturer automatiquement les sprints dont la date de fin est dépassée
export const migrateExpiredSprints = async (
  includeUserStories = true,
  includeTasks = true
) => {
  const sprints = await getAllSprints();
  const now = new Date();
  const results: Array<{
    sprintTitle: string;
    moved: number;
    completed: number;
    tasksMoved: number;
    tasksCompleted: number;
  }> = [];

  // Récupérer toutes les User Stories si nécessaire
  let userStories: UserStory[] = [];
  if (includeUserStories) {
    const userStoriesSnapshot = await getDocs(collection(db, "userStories"));
    userStories = userStoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserStory[];
  }

  // Récupérer toutes les Tasks si nécessaire
  let tasks: BacklogTask[] = [];
  if (includeTasks) {
    const tasksSnapshot = await getDocs(collection(db, "backlog_tasks"));
    tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BacklogTask[];
  }

  for (const sprint of sprints) {
    const endDate =
      sprint.endDate instanceof Date ? sprint.endDate : sprint.endDate.toDate();

    // Si le sprint n'est pas terminé mais que sa date de fin est dépassée
    if (sprint.status !== "done" && endDate < now) {
      console.log(
        `🔄 Clôture automatique du ${
          sprint.title
        } (fin: ${endDate.toLocaleDateString()})`
      );

      // Gérer les User Stories non terminées
      let usResult = { moved: 0, completed: 0 };
      if (includeUserStories) {
        usResult = await handleIncompleteUserStories(
          sprint.id,
          userStories,
          "backlog"
        );
      }

      // Gérer les Tasks non terminées
      let tasksResult = { moved: 0, completed: 0 };
      if (includeTasks) {
        tasksResult = await handleIncompleteTasks(
          sprint.id,
          tasks,
          userStories,
          "backlog"
        );
      }

      // Clôturer le sprint
      await closeSprint(sprint.id);

      results.push({
        sprintTitle: sprint.title,
        moved: usResult.moved,
        completed: usResult.completed,
        tasksMoved: tasksResult.moved,
        tasksCompleted: tasksResult.completed,
      });
    }
  }

  if (results.length > 0) {
    console.log(`✅ ${results.length} sprint(s) clôturé(s) automatiquement`);
    results.forEach((result) => {
      console.log(
        `  📊 ${result.sprintTitle}: ${result.completed} US terminées, ${result.moved} US reportées au backlog`
      );
      console.log(
        `     🎯 ${result.tasksCompleted} tâches terminées, ${result.tasksMoved} tâches reportées au backlog`
      );
    });
  } else {
    console.log("ℹ️ Aucun sprint à clôturer automatiquement");
  }

  return results;
};

//  Supprimer un sprint + nettoyer les user stories liées
export const deleteSprint = async (sprintId: string) => {
  const sprintRef = doc(db, "sprints", sprintId);
  const sprintSnap = await getDoc(sprintRef);

  if (!sprintSnap.exists()) {
    throw new Error("Sprint introuvable");
  }

  const sprintData = sprintSnap.data();
  if (sprintData.userStoryIds && sprintData.userStoryIds.length > 0) {
    throw new Error(
      "Impossible de supprimer un sprint avec des user stories liées."
    );
  }

  await deleteDoc(sprintRef);
};

//  Récupérer les tâches d'un sprint spécifique (pour vue historique)
export const getSprintTasks = async (
  sprintId: string,
  userStories: UserStory[]
): Promise<BacklogTask[]> => {
  try {
    // Récupérer toutes les tasks
    const tasksSnapshot = await getDocs(collection(db, "backlog_tasks"));
    const allTasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BacklogTask[];

    // Trouver les User Stories du sprint
    const sprintUserStoryIds = userStories
      .filter((story) => story.sprintId === sprintId)
      .map((story) => story.id);

    // Filtrer les tasks liées aux User Stories du sprint
    const sprintTasks = allTasks.filter((task) =>
      task.userStoryIds?.some((usId) => sprintUserStoryIds.includes(usId))
    );

    return sprintTasks;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches du sprint:",
      error
    );
    return [];
  }
};

//  Synchroniser les User Stories avec les sprints (réparer les incohérences)
export const syncSprintUserStories = async (): Promise<{ synced: number }> => {
  try {
    console.log("🔄 Synchronisation des User Stories avec les sprints...");

    // Récupérer tous les sprints et User Stories
    const sprints = await getAllSprints();
    const userStoriesSnapshot = await getDocs(collection(db, "userStories"));
    const userStories = userStoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserStory[];

    let syncedCount = 0;

    for (const sprint of sprints) {
      try {
        console.log(`🔍 Synchronisation du sprint: ${sprint.title}`);

        // Trouver les User Stories qui ont ce sprint comme sprintId
        const storiesWithThisSprintId = userStories
          .filter((story) => story.sprintId === sprint.id)
          .map((story) => story.id);

        // Comparer avec les userStoryIds stockés dans le sprint
        const currentUserStoryIds = sprint.userStoryIds || [];

        // Vérifier s'il y a une différence
        const needsSync =
          storiesWithThisSprintId.length !== currentUserStoryIds.length ||
          !storiesWithThisSprintId.every((id) =>
            currentUserStoryIds.includes(id)
          );

        if (needsSync) {
          console.log(
            `  � Sprint "${sprint.title}" nécessite une synchronisation`
          );
          console.log(`     Actuel: [${currentUserStoryIds.join(", ")}]`);
          console.log(`     Correct: [${storiesWithThisSprintId.join(", ")}]`);

          // Mettre à jour le sprint avec les bonnes userStoryIds
          // En conservant toutes les propriétés existantes pour respecter les règles Firebase
          const sprintRef = doc(collection(db, "sprints"), sprint.id);
          await updateDoc(sprintRef, {
            userStoryIds: storiesWithThisSprintId,
            // Conserver la date de modification
            updatedAt: Timestamp.now(),
          });

          console.log(`  ✅ Sprint "${sprint.title}" synchronisé`);
          syncedCount++;
        } else {
          console.log(`  ✅ Sprint "${sprint.title}" déjà synchronisé`);
        }
      } catch (sprintError) {
        console.error(
          `❌ Erreur lors de la synchronisation du sprint ${sprint.title}:`,
          sprintError
        );
        // Continuer avec les autres sprints même si un échoue
      }
    }

    console.log(
      `✅ Synchronisation terminée: ${syncedCount} sprint(s) mis à jour`
    );
    return { synced: syncedCount };
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
    throw error;
  }
};

//  Nettoyer les badges "sprint" des tâches des sprints terminés
export const cleanupCompletedSprintsBadges = async (): Promise<{
  cleaned: number;
}> => {
  try {
    console.log("🧹 Nettoyage des badges des sprints terminés...");

    // Récupérer tous les sprints terminés
    const sprints = await getAllSprints();
    const completedSprints = sprints.filter(
      (sprint) => sprint.status === "done"
    );

    if (completedSprints.length === 0) {
      console.log("ℹ️ Aucun sprint terminé trouvé");
      return { cleaned: 0 };
    }

    console.log(`📊 ${completedSprints.length} sprint(s) terminé(s) trouvé(s)`);

    // Récupérer toutes les User Stories et Tasks
    const userStoriesSnapshot = await getDocs(collection(db, "userStories"));
    const userStories = userStoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserStory[];

    const tasksSnapshot = await getDocs(collection(db, "backlog_tasks"));
    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BacklogTask[];

    console.log(
      `📋 ${userStories.length} User Stories et ${tasks.length} tâches trouvées`
    );

    let cleanedCount = 0;

    for (const sprint of completedSprints) {
      try {
        console.log(`🔍 Nettoyage du sprint terminé: ${sprint.title}`);

        // Trouver les User Stories du sprint
        const sprintUserStoryIds = userStories
          .filter((story) => story.sprintId === sprint.id)
          .map((story) => story.id);

        console.log(
          `   🎯 ${sprintUserStoryIds.length} User Stories dans ce sprint`
        );

        // Trouver les tasks liées à ce sprint
        const sprintTasks = tasks.filter(
          (task) =>
            task.userStoryIds?.some((usId) =>
              sprintUserStoryIds.includes(usId)
            ) && task.badge === "sprint" // Seulement celles qui ont encore le badge
        );

        if (sprintTasks.length > 0) {
          console.log(
            `📝 ${sprintTasks.length} tâches à nettoyer dans ${sprint.title}`
          );

          // Retirer le badge "sprint" de toutes ces tâches
          const taskCollection = collection(db, "backlog_tasks");
          const updates = sprintTasks.map(async (task) => {
            try {
              const taskRef = doc(taskCollection, task.id!);
              await updateDoc(taskRef, {
                badge: null, // Retirer le badge "sprint"
              });
              console.log(`  ✅ Badge retiré de "${task.title}"`);
              return true;
            } catch (taskError) {
              console.error(
                `  ❌ Erreur pour la tâche "${task.title}":`,
                taskError
              );
              return false;
            }
          });

          const results = await Promise.all(updates);
          const successCount = results.filter(Boolean).length;
          cleanedCount += successCount;

          console.log(
            `   ✅ ${successCount}/${sprintTasks.length} tâches nettoyées avec succès`
          );
        } else {
          console.log(
            `   ℹ️ Aucune tâche avec badge "sprint" trouvée dans ${sprint.title}`
          );
        }
      } catch (sprintError) {
        console.error(
          `❌ Erreur lors du traitement du sprint ${sprint.title}:`,
          sprintError
        );
      }
    }

    console.log(
      `✅ Nettoyage terminé: ${cleanedCount} tâches nettoyées au total`
    );
    return { cleaned: cleanedCount };
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage des badges:", error);
    throw error;
  }
};
