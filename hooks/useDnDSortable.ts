import { useState } from "react";
import {
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";

interface UseDnDSortableProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  getItemId: (item: T) => string; // Fonction pour récupérer l'ID d'un élément
  getItemSection: (item: T) => string; // Fonction pour récupérer la section d'un élément
}

export function useDnDSortable<T>({
  items,
  setItems,
  getItemId,
  getItemSection,
}: UseDnDSortableProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeItem = items.find((item) => getItemId(item) === active.id);
    const overItem = items.find((item) => getItemId(item) === over.id);

    if (!activeItem || !overItem) {
      setActiveId(null);
      return;
    }

    // Vérifie si les éléments appartiennent à la même section
    if (getItemSection(activeItem) !== getItemSection(overItem)) {
      console.log("❌ Items are in different sections, drag canceled");
      setActiveId(null);
      return;
    }

    // Réorganise les éléments dans la même section
    const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
    const newIndex = items.findIndex((item) => getItemId(item) === over.id);

    const updatedItems = arrayMove(items, oldIndex, newIndex);
    setItems(updatedItems);

    setActiveId(null);
  };

  return {
    activeId,
    sensors,
    collisionDetection: closestCenter,
    handleDragStart,
    handleDragEnd,
  };
}
