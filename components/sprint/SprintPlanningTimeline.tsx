"use client";

import React from "react";
import { Rocket, BarChart2 } from "lucide-react";
import { SprintCard } from "@/components/sprint/SprintCard";
import {
  buildTimelineItemsUserStories,
  TimelineItem,
} from "@/lib/utils/buildTimelineItemsUserStories";
import { useTimeline } from "@/context/TimelineContext";

export default function SprintPlanningTimeline() {
  const { sprints, userStories, tasks, loading } = useTimeline();

  if (loading) {
    return <div>Chargement du planning du sprint...</div>;
  }

  const sections = [
    {
      id: "planning",
      title: "Sprint Planifié",
      icon: <Rocket className="w-5 h-5 text-primary" />,
    },
    {
      id: "execution",
      title: "Sprint Execution",
      icon: <Rocket className="w-5 h-5 text-primary" />,
    },
    {
      id: "review",
      title: "Sprint Review",
      icon: <BarChart2 className="w-5 h-5 text-primary" />,
    },
  ];

  const items: TimelineItem[] = buildTimelineItemsUserStories(
    sprints,
    userStories,
    tasks
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="relative">
            <div className="flex items-center mb-4 space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-4 ml-5 pb-4 w-max">
                {items
                  .filter((item) => item.section === section.id)
                  .map((item) => (
                    <SprintCard key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
