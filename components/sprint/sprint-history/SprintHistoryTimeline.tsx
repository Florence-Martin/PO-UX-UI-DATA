"use client";

import React, { useMemo, useState } from "react";
import { History as HistoryIcon } from "lucide-react";

import { SprintHistoryCard } from "./SprintHistoryCard";
import SprintFilter, {
  SprintFilterValue,
} from "@/components/searchbar/SprintFilter";

import { useTimeline } from "@/context/TimelineContext";

export function SprintHistoryTimeline() {
  const { sprints, loading } = useTimeline();
  const [filter, setFilter] = useState<SprintFilterValue>("all");

  const filteredSprints = useMemo(() => {
    const pastSprints = sprints.filter((s) => s.status === "done");
    if (filter === "last3") return pastSprints.slice(-3).reverse();
    if (filter === "last6") return pastSprints.slice(-6).reverse();
    return pastSprints.reverse();
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
          {filteredSprints.map((sprint) => (
            <SprintHistoryCard key={sprint.id} sprint={sprint} />
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
