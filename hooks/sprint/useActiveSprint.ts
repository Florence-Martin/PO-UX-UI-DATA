"use client";

import { db } from "@/lib/firebase"; // Assure-toi que ce chemin est correct
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
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
 * Hook pour récupérer et écouter en temps réel le sprint actif.
 */
export function useActiveSprint() {
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchAndSubscribe = async () => {
      try {
        const sprints = await getAllSprints();

        const sorted = sprints.sort(
          (a, b) =>
            parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()
        );

        // D'abord chercher un sprint marqué comme actif (isActive = true)
        let current =
          sorted.find(
            (sprint) => sprint.isActive && sprint.status !== "done"
          ) || null;

        // Si aucun sprint n'est marqué comme actif, fallback sur la logique par date
        if (!current) {
          current = sorted.find(isCurrentSprint) || null;
        }

        setActiveSprint(current);

        // Abonnement temps réel si un sprint actif existe
        if (current) {
          unsubscribe = onSnapshot(
            doc(db, "sprints", current.id),
            (docSnap) => {
              if (docSnap.exists()) {
                setActiveSprint({
                  id: docSnap.id,
                  ...docSnap.data(),
                } as Sprint);
              }
            }
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement du sprint actif :", error);
      }
    };

    fetchAndSubscribe();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { activeSprint };
}
