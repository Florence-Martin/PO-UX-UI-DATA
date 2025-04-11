"use client";

import { useEffect, useState } from "react";
import { getUserStoriesByMoscow } from "@/lib/services/userStoryService";
import { UserStory } from "@/lib/types/userStory";
import { MoscowColumn } from "./MoscowColumn";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

export function MoscowPrioritization() {
  const [data, setData] = useState<{
    mustHave: UserStory[];
    shouldHave: UserStory[];
    couldHave: UserStory[];
    wontHave: UserStory[];
  }>({
    mustHave: [],
    shouldHave: [],
    couldHave: [],
    wontHave: [],
  });

  const [hash, setHash] = useState<string>("");

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

  // Sensors pour le drag
  const sensors = useSensors(useSensor(PointerSensor));

  // À implémenter plus tard : logique de mise à jour après un drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log("Déplacé :", active.id, "vers", over.id);
    // Ici, tu pourras mettre à jour le statut moscow de la US
  };

  const columns = [
    { label: "Must Have", key: "mustHave" },
    { label: "Should Have", key: "shouldHave" },
    { label: "Could Have", key: "couldHave" },
    { label: "Won’t Have", key: "wontHave" },
  ] as const;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(({ label, key }) => (
          <MoscowColumn
            key={`${key}-${hash}`} // Permet de déclencher un re-render si hash change
            label={label}
            stories={data[key]}
          />
        ))}
      </div>
    </DndContext>
  );
}
