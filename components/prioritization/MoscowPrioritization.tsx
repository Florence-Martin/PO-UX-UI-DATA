"use client";

import { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { updateUserStory, getUserStoriesByMoscow } from "@/lib/services/userStoryService";
import { UserStory } from "@/lib/types/userStory";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { MoscowColumn } from "./MoscowColumn";

export type MoscowKey = "mustHave" | "shouldHave" | "couldHave" | "wontHave";

type MoscowBoardData = Record<MoscowKey, UserStory[]>;

const MOSCOW_COLUMNS: MoscowKey[] = [
  "mustHave",
  "shouldHave",
  "couldHave",
  "wontHave",
];

const COLUMN_LABELS: Record<MoscowKey, string> = {
  mustHave: "Must Have",
  shouldHave: "Should Have",
  couldHave: "Could Have",
  wontHave: "Won’t Have",
};

function moveStoryBetweenColumns(
  board: MoscowBoardData,
  storyId: string,
  from: MoscowKey,
  to: MoscowKey
): MoscowBoardData {
  const movedStory = board[from].find((story) => story.id === storyId);
  if (!movedStory) return board;

  return {
    ...board,
    [from]: board[from].filter((story) => story.id !== storyId),
    [to]: [{ ...movedStory, moscow: to }, ...board[to]],
  };
}

export function MoscowPrioritization() {
  const [board, setBoard] = useState<MoscowBoardData>({
    mustHave: [],
    shouldHave: [],
    couldHave: [],
    wontHave: [],
  });
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    void getUserStoriesByMoscow().then(setBoard);
  }, []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveStoryId(String(active.id));
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveStoryId(null);

    if (!over) return;

    const storyId = String(active.id);
    const fromColumn = active.data.current?.fromColumn as MoscowKey | undefined;
    const toColumn = over.data.current?.columnId as MoscowKey | undefined;

    if (!fromColumn || !toColumn || fromColumn === toColumn) {
      return;
    }

    const previousBoard = board;
    const nextBoard = moveStoryBetweenColumns(
      previousBoard,
      storyId,
      fromColumn,
      toColumn
    );

    setBoard(nextBoard);

    try {
      await updateUserStory(storyId, { moscow: toColumn });
    } catch (error) {
      setBoard(previousBoard);
      console.error("Erreur lors du déplacement MoSCoW :", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOSCOW_COLUMNS.map((columnId) => (
          <MoscowColumn
            key={columnId}
            label={COLUMN_LABELS[columnId]}
            columnId={columnId}
            stories={board[columnId]}
            activeStoryId={activeStoryId}
          />
        ))}
      </div>
    </DndContext>
  );
}
