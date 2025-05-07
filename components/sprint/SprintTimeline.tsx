"use client";

import React, { useEffect, useState } from "react";
import { Rocket, BarChart2 } from "lucide-react";

import { SprintCard } from "@/components/sprint/SprintCard";

import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { BacklogTask } from "@/lib/types/backlogTask";

import { getAllUserStories } from "@/lib/services/userStoryService";
import { getAllSprints } from "@/lib/services/sprintService";
import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";

import {
  buildTimelineItemsUserStories,
  TimelineItem,
} from "@/lib/utils/buildTimelineItemsUserStories";

export default function SprintTimeline() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userStoriesData, sprintsData, backlogTasksData] =
          await Promise.all([
            getAllUserStories(),
            getAllSprints(),
            getAllBacklogTasks(),
          ]);
        setUserStories(userStoriesData);
        setSprints(sprintsData);
        setTasks(backlogTasksData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement du planning du sprint...</div>;
  }

  const sections = [
    {
      icon: <Rocket className="w-5 h-5 text-primary" />,
      title: "Sprint Execution",
      id: "execution",
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-primary" />,
      title: "Sprint Review",
      id: "review",
    },
  ];

  // Construire les éléments de la timeline à partir de TOUS les sprints
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

            {/* Scroll horizontal complet */}
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
