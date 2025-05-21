"use client";

import { Calendar, TrendingUp, Tags } from "lucide-react";
import { Sprint } from "@/lib/types/sprint";
import { useTimeline } from "@/context/TimelineContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SprintUserStories } from "./SprintUserStories";

const getDate = (d: any): Date => d?.toDate?.() ?? new Date(d);
const formatDate = (date: any): string =>
  format(getDate(date), "dd MMMM yyyy", { locale: fr });

interface SprintHistoryCardProps {
  sprint: Sprint;
}

export function SprintHistoryCard({ sprint }: SprintHistoryCardProps) {
  const { userStories } = useTimeline();

  const sprintUserStories = sprint.userStoryIds.map((id) => {
    const us = userStories.find((u) => u.id === id);
    return us ? `${us.code} — ${us.title}` : "US inconnue";
  });

  const velocity = sprint.userStoryIds.reduce((total, id) => {
    const us = userStories.find((u) => u.id === id);
    return total + (us?.storyPoints || 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5 h-full min-h-[360px]">
      {/* Titre + dates */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-foreground">{sprint.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="w-4 h-4" />
          {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
        </div>
      </div>

      {/* 🎯 Objectif */}
      <div className="text-sm text-muted-foreground italic flex gap-2 items-center min-h-[24px]">
        <span className="text-base">🎯</span>
        <span>
          <strong>Objectif :</strong>{" "}
          {sprint.goal ? (
            <span className="not-italic text-foreground">{sprint.goal}</span>
          ) : (
            <span className="opacity-50">Non défini</span>
          )}
        </span>
      </div>

      {/* US livrées */}
      <SprintUserStories sprintUserStories={sprintUserStories} />

      {/* Vélocité */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4" />
        <span>
          <span>Vélocité :</span>{" "}
          <span className="text-foreground font-semibold">
            {velocity} points
          </span>
        </span>
      </div>

      {/* Dates clés */}
      <div className="border-t pt-4 mt-2 space-y-1">
        <h4 className="text-sm font-medium text-muted-foreground">
          Dates clés :
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col text-blue-500">
            <span>Review :</span>
            <span className="font-semibold text-foreground">
              {sprint.hasReview && sprint.closedAt ? (
                formatDate(sprint.closedAt)
              ) : (
                <span className="opacity-50">Non défini</span>
              )}
            </span>
          </div>
          <div className="flex flex-col text-purple-500">
            <span>Rétrospective :</span>
            <span className="font-semibold text-foreground">
              {sprint.hasRetrospective && sprint.closedAt ? (
                formatDate(sprint.closedAt)
              ) : (
                <span className="opacity-50">Non défini</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
