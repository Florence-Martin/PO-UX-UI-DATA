import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp } from "firebase/firestore";

/**
 * Convertit une date (string, Date ou Timestamp) en instance de Date.
 */
function parseDate(date: Date | string | Timestamp): Date {
  if (date instanceof Timestamp) return date.toDate();
  return new Date(date);
}

/**
 * Vérifie si le sprint est actif (en cours).
 */
function isCurrentSprint(sprint: Sprint): boolean {
  const now = new Date();
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);
  return now >= start && now <= end;
}

/**
 * Hook pour charger les sprints, les trier et identifier celui en cours.
 */
export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  const refetch = async () => {
    try {
      const data = await getAllSprints();

      // Tri ascendant par date de début
      const sorted = [...data].sort(
        (a, b) =>
          parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()
      );

      setSprints(sorted);

      const active = sorted.find(isCurrentSprint) || null;
      setCurrentSprint(active);
    } catch (error) {
      console.error("Erreur lors du chargement des sprints :", error);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { sprints, currentSprint, refetch };
}
