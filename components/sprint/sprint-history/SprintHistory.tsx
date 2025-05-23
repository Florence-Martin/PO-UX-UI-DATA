"use client";

import React from "react";
import { History as HistoryIcon } from "lucide-react";
import { SprintCard } from "@/components/sprint/SprintCard";
import {
  buildTimelineItemsUserStories,
  TimelineItem,
} from "@/lib/utils/buildTimelineItemsUserStories";
import { useTimeline } from "@/context/TimelineContext";

export default function SprintHistory() {
  const { sprints, userStories, tasks, loading } = useTimeline();

  if (loading) {
    return <div>Chargement de l&#39;historique des sprints...</div>;
  }

  const items: TimelineItem[] = buildTimelineItemsUserStories(
    sprints,
    userStories,
    tasks
  );

  const reviewItems = items.filter((item) => item.section === "review");

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-4 space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
          <HistoryIcon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Historique des Sprints (Review)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 ml-5 pb-4 w-max">
          {reviewItems.length === 0 ? (
            <p className="text-muted-foreground">Aucun sprint terminé.</p>
          ) : (
            reviewItems.map((item) => <SprintCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}
