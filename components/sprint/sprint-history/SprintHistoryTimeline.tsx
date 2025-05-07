"use client";

import React from "react";
import { History as HistoryIcon } from "lucide-react";
import { Sprint } from "@/lib/types/sprint";
import SprintFilter from "@/components/searchbar/SprintFilter";
import { SprintHistoryCard } from "./SprintHistoryCard";
import { useSprintList } from "@/hooks/useSprintList";

interface SprintHistoryTimelineProps {
  sprints: Sprint[];
}

export function SprintHistoryTimeline({ sprints }: SprintHistoryTimelineProps) {
  const [filter, setFilter] = React.useState("all");

  // Utiliser le hook pour récupérer les User Stories
  const { userStories } = useSprintList(() => {});

  const filteredSprints = React.useMemo(() => {
    const pastSprints = sprints.filter((s) => s.status === "done");

    if (filter === "last3") return pastSprints.slice(-3).reverse();
    if (filter === "last6") return pastSprints.slice(-6).reverse();
    return pastSprints.reverse(); // "all"
  }, [sprints, filter]);

  return (
    <div className="w-full bg-muted rounded-md p-4 sm:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <HistoryIcon className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold text-foreground">
            Historique des Sprints
          </h2>
        </div>
        <SprintFilter defaultValue="all" onChange={setFilter} />
      </div>

      {filteredSprints.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSprints.map((sprint) => (
            <SprintHistoryCard
              key={sprint.id}
              sprint={sprint}
              userStories={userStories.map((story) => ({
                ...story,
                code: story.code || "N/A",
              }))}
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
