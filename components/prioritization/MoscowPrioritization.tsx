"use client";

import { useEffect, useState } from "react";
import { getUserStoriesByMoscow } from "@/lib/services/userStoryService";
import { updateUserStory } from "@/lib/services/userStoryService";
import { UserStory } from "@/lib/types/userStory";
import { MoscowColumn } from "./MoscowColumn";
import { PrioritisedUserStoryCard } from "./PrioritisedUserStoryCard";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";

// Définition du type des clés MoSCoW
export type MoscowKey = "mustHave" | "shouldHave" | "couldHave" | "wontHave";

export function MoscowPrioritization() {
  const [data, setData] = useState<Record<MoscowKey, UserStory[]>>({
    mustHave: [],
    shouldHave: [],
    couldHave: [],
    wontHave: [],
  });

  const [hash, setHash] = useState<string>("");
  const [activeStory, setActiveStory] = useState<UserStory | null>(null);

  // Met à jour le hash si l’URL change (ex: #us-xxx)
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Charge les user stories groupées par MoSCoW
  useEffect(() => {
    getUserStoriesByMoscow().then(setData);
  }, []);

  // Gestion du drag

  const handleDragStart = (event: DragStartEvent) => {
    const storyId = event.active.id as string;
    const story = Object.values(data)
      .flat()
      .find((s) => s.id === storyId);
    if (story) setActiveStory(story);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStory(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const newMoscow = over.id as MoscowKey;

    try {
      await updateUserStory(activeId, { moscow: newMoscow as MoscowKey });
      const updated = await getUserStoriesByMoscow();
      setData(updated);
    } catch (error) {
      console.error("Erreur lors du déplacement :", error);
    }
  };

  const columns = [
    { label: "Must Have", key: "mustHave" },
    { label: "Should Have", key: "shouldHave" },
    { label: "Could Have", key: "couldHave" },
    { label: "Won’t Have", key: "wontHave" },
  ] as const;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(({ label, key }) => (
          <MoscowColumn
            key={`${key}-${hash}`} // Permet de déclencher un re-render si hash change
            label={label}
            columnId={key}
            stories={data[key]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeStory && (
          <div className="w-[300px]">
            <PrioritisedUserStoryCard story={activeStory} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
