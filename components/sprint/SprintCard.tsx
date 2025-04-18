import { CalendarDays } from "lucide-react";
import React from "react";

interface TaskCardProps {
  item: {
    title: string;
    date: string;
    description: string;
    section?: string;
  };
  overlay?: boolean;
}

const sectionColors: Record<string, string> = {
  planning: "border-blue-500",
  execution: "border-green-500",
  review: "border-yellow-500",
  retro: "border-purple-500",
};

export function SprintCard({ item, overlay }: TaskCardProps) {
  const colorClass = item.section
    ? sectionColors[item.section] || "border-muted"
    : "border-muted";

  return (
    <div
      className={`
        w-72 flex-shrink-0 cursor-move relative
        rounded-xl border-l-4 bg-card p-4 pl-5 transition-shadow mt-1 ml-1
        ${colorClass}
        ${overlay ? "shadow-xl" : "shadow-sm"}
        hover:ring-2 hover:ring-primary/40
      `}
    >
      {/* Date + icône */}
      <div className="absolute top-4 left-5 text-muted-foreground text-xs flex items-center gap-1">
        <CalendarDays className="w-4 h-4" />
        {item.date}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
      </div>
    </div>
  );
}
