import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSprintItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableSprintItem({ id, children }: SortableSprintItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
    >
      {children}
    </div>
  );
}
