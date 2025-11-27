"use client";

import { db } from "@/lib/firebase";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Convertit n'importe quel format de date en Date JS.
 */
function parseDate(date: Date | string | Timestamp): Date {
  if (date instanceof Timestamp) return date.toDate();
  return new Date(date);
}

/**
 * Vérifie si un sprint est en cours (inclut toute la journée de fin).
 */
function isCurrentSprint(sprint: Sprint): boolean {
  const now = new Date();
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);

  // Inclure toute la journée de fin
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

/**
 * 🆕 Hook pour récupérer TOUS les sprints actifs (supporte plusieurs sprints simultanés).
 *
 * Un sprint est considéré comme actif si :
 * 1. isActive === true ET status !== "done" (priorité 1)
 * 2. OU date actuelle dans [startDate, endDate] ET status !== "done" (fallback)
 *
 * @returns {
 *   activeSprints: Sprint[] - Liste de tous les sprints actifs
 *   selectedSprint: Sprint | null - Sprint sélectionné (par défaut le premier)
 *   setSelectedSprint: (sprint: Sprint | null) => void - Change le sprint sélectionné
 * }
 */
export function useActiveSprints() {
  const [activeSprints, setActiveSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    // Écoute temps réel de la collection sprints
    const unsubscribe = onSnapshot(
      collection(db, "sprints"),
      async () => {
        try {
          const sprints = await getAllSprints();

          const sorted = sprints.sort(
            (a, b) =>
              parseDate(a.startDate).getTime() -
              parseDate(b.startDate).getTime()
          );

          // 🆕 Récupérer TOUS les sprints actifs
          const activeSprintsList = sorted.filter((sprint) => {
            // Priorité 1 : Flag isActive
            if (sprint.isActive && sprint.status !== "done") return true;

            // Priorité 2 : Date range
            return isCurrentSprint(sprint) && sprint.status !== "done";
          });

          setActiveSprints(activeSprintsList);

          // Sélectionner le premier sprint actif par défaut si aucun n'est sélectionné
          // ou si le sprint sélectionné n'est plus dans la liste des sprints actifs
          if (activeSprintsList.length > 0) {
            if (
              !selectedSprint ||
              !activeSprintsList.find((s) => s.id === selectedSprint.id)
            ) {
              setSelectedSprint(activeSprintsList[0]);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des sprints :", error);
        }
      },
      (error) => {
        console.error("Erreur onSnapshot sprints :", error);
      }
    );

    return () => unsubscribe();
  }, [selectedSprint]);

  return {
    activeSprints, // Tous les sprints actifs
    selectedSprint, // Sprint actuellement sélectionné
    setSelectedSprint, // Permet de changer le sprint affiché
  };
}
