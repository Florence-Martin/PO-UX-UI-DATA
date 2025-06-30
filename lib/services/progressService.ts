// lib/services/progressService.ts
const PROGRESS_STORAGE_KEY = "wireframes-progress";

export type ProgressLevel = 0 | 1 | 2 | 3 | 4;

const PROGRESS_VALUES: Record<ProgressLevel, number> = {
  0: 0, // Pas commencé
  1: 25, // Démarré
  2: 50, // En cours
  3: 75, // Avancé
  4: 100, // Terminé
};

const PROGRESS_LABELS: Record<ProgressLevel, string> = {
  0: "Pas commencé",
  1: "Démarré",
  2: "En cours",
  3: "Avancé",
  4: "Terminé",
};

export const getWireframesProgressLevel = (): ProgressLevel => {
  if (typeof window === "undefined") return 0;

  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  const level = stored ? parseInt(stored) : 0;
  return level >= 0 && level <= 4 ? (level as ProgressLevel) : 0;
};

export const setWireframesProgressLevel = (level: ProgressLevel): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(PROGRESS_STORAGE_KEY, level.toString());

  // Notifier les autres composants
  window.dispatchEvent(
    new CustomEvent("wireframes-progress-updated", {
      detail: { level, progress: PROGRESS_VALUES[level] },
    })
  );
};

export const getWireframesProgress = (): number => {
  const level = getWireframesProgressLevel();
  return PROGRESS_VALUES[level];
};

export { PROGRESS_VALUES, PROGRESS_LABELS };
