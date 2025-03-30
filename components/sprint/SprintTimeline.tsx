"use client";

import React, { useState } from "react";
import { Calendar, Rocket, BarChart2, RefreshCw } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSprintItem } from "@/components/sprint/SortableSprintItem";
import { SprintCard } from "@/components/sprint/SprintCard";
import { useDnDSortable } from "@/hooks/useDnDSortable";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  section: string;
}

export default function SprintTimeline() {
  const sections = [
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "Sprint Planning",
      id: "planning",
    },
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
    {
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      title: "Sprint Retrospective",
      id: "retro",
    },
  ];

  const [items, setItems] = useState<TimelineItem[]>([
    {
      id: "1",
      title: "Gather User Stories",
      date: "Mar 28-29",
      description: "Collect and document user requirements",
      section: "planning",
    },
    {
      id: "2",
      title: "Estimate User Stories",
      date: "Mar 29-30",
      description: "Team estimation and planning",
      section: "planning",
    },
    {
      id: "3",
      title: "Create Sprint Backlog",
      date: "Mar 30-31",
      description: "Prioritize and finalize sprint items",
      section: "planning",
    },
    {
      id: "4",
      title: "Develop User Stories",
      date: "Mar 30 - Apr 4",
      description: "Implementation of planned features",
      section: "execution",
    },
    {
      id: "5",
      title: "Daily Standup Meetings",
      date: "Mar 31 - Apr 3",
      description: "Team sync and progress updates",
      section: "execution",
    },
    {
      id: "6",
      title: "Code Review and Testing",
      date: "Apr 1-4",
      description: "Quality assurance and validation",
      section: "execution",
    },
    {
      id: "7",
      title: "Demo Completed",
      date: "Apr 3-4",
      description: "Present sprint achievements",
      section: "review",
    },
    {
      id: "8",
      title: "Collect Feedback",
      date: "Apr 3-4",
      description: "Stakeholder feedback gathering",
      section: "review",
    },
    {
      id: "9",
      title: "Reflect on Sprint",
      date: "Apr 3-4",
      description: "Team reflection and discussion",
      section: "retro",
    },
    {
      id: "10",
      title: "Identify Improvements",
      date: "Apr 3-4",
      description: "Action items for next sprint",
      section: "retro",
    },
  ]);

  const {
    activeId,
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragEnd,
  } = useDnDSortable({
    items,
    setItems,
    getItemId: (item) => item.id,
    getItemSection: (item) => item.section, // Ajout de la gestion des sections
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-6">
          <p className="mt-2 text-muted-foreground">Mars - Avril 2024</p>
        </div>

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

              <div className="ml-5">
                <DndContext
                  sensors={sensors}
                  collisionDetection={collisionDetection}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items
                      .filter((item) => item.section === section.id)
                      .map((item) => item.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {items
                        .filter((item) => item.section === section.id)
                        .map((item) => (
                          <SortableSprintItem key={item.id} id={item.id}>
                            <SprintCard item={item} />
                          </SortableSprintItem>
                        ))}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {activeId ? (
                      <SprintCard
                        item={items.find((item) => item.id === activeId)!}
                        overlay
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
