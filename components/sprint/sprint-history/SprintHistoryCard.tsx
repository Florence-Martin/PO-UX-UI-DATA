import {
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Tags,
} from "lucide-react";
import { Sprint } from "@/lib/types/sprint";
import { formatDateToFrenchString } from "@/lib/utils/formatDateToFrenchString";

// Fonction utilitaire pour gérer les dates
const getDate = (d: any) => d?.toDate?.() ?? new Date(d);

interface SprintHistoryCardProps {
  sprint: Sprint;
  userStories: {
    id: string;
    title: string;
    code: string;
    storyPoints: number;
  }[];
}

export function SprintHistoryCard({
  sprint,
  userStories,
}: SprintHistoryCardProps) {
  const formattedStart = formatDateToFrenchString(
    getDate(sprint.startDate).toISOString()
  );
  const formattedEnd = formatDateToFrenchString(
    getDate(sprint.endDate).toISOString()
  );

  // Récupérer les User Stories associées au sprint
  const sprintUserStories = sprint.userStoryIds.map((id) => {
    const userStory = userStories.find((us) => us.id === id);
    return userStory
      ? `${userStory.code || "Code inconnu"} - ${userStory.title}`
      : "US inconnue";
  });

  // Calculer la vélocité à partir des User Stories
  const velocity = sprint.userStoryIds.reduce((total, id) => {
    const userStory = userStories.find((us) => us.id === id);
    return total + (userStory?.storyPoints || 0);
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

      {/* Dates */}
      <div className="flex items-center text-muted-foreground text-sm mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        {formattedStart} → {formattedEnd}
      </div>

      {/* User Stories */}
      <div className="mb-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
          <Tags className="h-4 w-4 mr-2" />
          US livrées :
        </div>
        <div className="flex flex-wrap gap-1">
          {sprintUserStories.length > 0 ? (
            sprintUserStories.map((us, index) => (
              <span
                key={index}
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

      {/* Accès aux actions */}
      {(sprint.hasReview || sprint.hasRetrospective) && (
        <div className="border-t pt-3 mt-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Accès à :
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            {sprint.hasReview && (
              <a
                // href={`/sprints/${sprint.id}/review`}
                href={`/not-found`}
                className="flex  text-blue-400 hover:underline"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Review Summary
              </a>
            )}
            {sprint.hasRetrospective && (
              <a
                // href={`/sprints/${sprint.id}/retrospective`}
                href={`/not-found`}
                className="flex  text-purple-400 hover:underline"
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
