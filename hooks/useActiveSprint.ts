"use client";

import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp } from "firebase/firestore";

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
 * Hook pour récupérer uniquement le sprint actif.
 */
export function useActiveSprint() {
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    const fetchActiveSprint = async () => {
      try {
        const sprints = await getAllSprints();

        const sorted = sprints.sort(
          (a, b) =>
            parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()
        );

        const current = sorted.find(isCurrentSprint) || null;
        setActiveSprint(current);
      } catch (error) {
        console.error("Erreur lors du chargement du sprint actif :", error);
      }
    };

    fetchActiveSprint();
  }, []);

  return { activeSprint };
}
