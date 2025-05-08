"use client";

import {
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Tags,
} from "lucide-react";
import { Sprint } from "@/lib/types/sprint";
import { formatDateToFrenchString } from "@/lib/utils/formatDateToFrenchString";
import { useTimeline } from "@/context/TimelineContext";

// Fonction utilitaire pour gérer les dates Firestore ou JS
const getDate = (d: any) => d?.toDate?.() ?? new Date(d);

interface SprintHistoryCardProps {
  sprint: Sprint;
}

export function SprintHistoryCard({ sprint }: SprintHistoryCardProps) {
  const { userStories } = useTimeline();

  const formattedStart = formatDateToFrenchString(
    getDate(sprint.startDate).toISOString()
  );
  const formattedEnd = formatDateToFrenchString(
    getDate(sprint.endDate).toISOString()
  );

  // User stories livrées dans ce sprint
  const sprintUserStories = sprint.userStoryIds.map((id) => {
    const us = userStories.find((u) => u.id === id);
    return us ? `${us.code || "Code inconnu"} - ${us.title}` : "US inconnue";
  });

  // Calcul de la vélocité
  const velocity = sprint.userStoryIds.reduce((total, id) => {
    const us = userStories.find((u) => u.id === id);
    return total + (us?.storyPoints || 0);
  }, 0);

  return (
    <div className="rounded-lg border border-border bg-background shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      {/* Titre et vélocité */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
        <h3 className="font-semibold text-lg text-foreground mb-2 md:mb-0">
          {sprint.title}
        </h3>
        <span className="text-sm px-3 py-1 bg-muted text-primary font-medium rounded-full">
          {velocity} points
        </span>
      </div>

      {/* Dates du sprint */}
      <div className="flex items-center text-muted-foreground text-sm mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        {formattedStart} → {formattedEnd}
      </div>

      {/* US livrées */}
      <div className="mb-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
          <Tags className="h-4 w-4 mr-2" />
          US livrées :
        </div>
        <div className="flex flex-wrap gap-1">
          {sprintUserStories.length > 0 ? (
            sprintUserStories.map((us, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
              >
                {us}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              Aucune User Story livrée.
            </span>
          )}
        </div>
      </div>

      {/* Vélocité */}
      <div className="flex items-center text-muted-foreground text-sm mb-2">
        <TrendingUp className="h-4 w-4 mr-2" />
        Vélocité : <span className="ml-1">{velocity} points</span>
      </div>

      {/* Liens complémentaires */}
      {(sprint.hasReview || sprint.hasRetrospective) && (
        <div className="border-t pt-3 mt-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Accès à :
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            {sprint.hasReview && (
              <a
                href={`/not-found`}
                className="flex text-blue-400 hover:underline"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Review Summary
              </a>
            )}
            {sprint.hasRetrospective && (
              <a
                href={`/not-found`}
                className="flex text-purple-400 hover:underline"
              >
                <FileText className="h-4 w-4 mr-1" />
                Retrospective Actions
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
