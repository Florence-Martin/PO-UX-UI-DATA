"use client";

import React, { useMemo, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { SprintHistoryCard } from "./SprintHistoryCard";
import SprintFilter, {
  SprintFilterValue,
} from "@/components/searchbar/SprintFilter";

import { useTimeline } from "@/context/TimelineContext";

/**
 * Convertit n'importe quel format de date en Date JS.
 */
function parseDate(date: Date | string | Timestamp): Date {
  if (date instanceof Timestamp) return date.toDate();
  return new Date(date);
}

export function SprintHistoryTimeline() {
  const { sprints, loading } = useTimeline();
  const [filter, setFilter] = useState<SprintFilterValue>("all");

  const filteredSprints = useMemo(() => {
    // Filtrer les sprints terminés et trier par ordre chronologique décroissant
    const pastSprints = sprints
      .filter((s) => s.status === "done")
      .sort((a, b) => {
        // Priorité 1: Utiliser closedAt si disponible, sinon endDate
        const dateA = a.closedAt ? parseDate(a.closedAt) : parseDate(a.endDate);
        const dateB = b.closedAt ? parseDate(b.closedAt) : parseDate(b.endDate);
        
        // Tri principal par date de fin/clôture (plus récent en premier)
        const timeDiff = dateB.getTime() - dateA.getTime();
        
        // Si égalité de date de fin, départager par date de début (plus récent en premier)
        if (timeDiff === 0) {
          const startA = parseDate(a.startDate);
          const startB = parseDate(b.startDate);
          const startTimeDiff = startB.getTime() - startA.getTime();
          
          // Si même date de début aussi, utiliser le numéro de sprint comme dernier critère
          if (startTimeDiff === 0) {
            const numA = parseInt(a.title.match(/Sprint (\d+)/)?.[1] || '0');
            const numB = parseInt(b.title.match(/Sprint (\d+)/)?.[1] || '0');
            return numB - numA; // Plus grand numéro en premier
          }
          
          return startTimeDiff;
        }
        
        return timeDiff;
      });

    // Appliquer les filtres sur la liste triée
    if (filter === "last3") return pastSprints.slice(0, 3);
    if (filter === "last6") return pastSprints.slice(0, 6);
    return pastSprints;
  }, [sprints, filter]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement des sprints…</p>;
  }

  return (
    <div className="w-full bg-muted rounded-md p-4 sm:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <HistoryIcon className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold text-foreground">
            Historique des Sprints
          </h2>
        </div>
        <SprintFilter defaultValue="all" onChange={(v) => setFilter(v)} />
      </div>

      {filteredSprints.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSprints.map((sprint, index) => (
            <SprintHistoryCard 
              key={`${sprint.id}-${index}-${filter}`} 
              sprint={sprint} 
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          Aucun sprint terminé à afficher.
        </div>
      )}
    </div>
  );
}
