"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableSectionProps {
  label?: string;
  content: string;
  isLong: boolean;
  clampClass?: string;
  fullClass?: string;
  className?: string;
}

export const ExpandableSection = ({
  label,
  content,
  isLong,
  clampClass = "line-clamp-2",
  fullClass = "",
  className = "",
}: ExpandableSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${className} relative`}>
      <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide py-1">
        {label}
      </p>
      <p
        className={`text-sm whitespace-pre-line ${
          expanded ? fullClass : clampClass
        }`}
      >
        {content}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-blue-500 hover:underline transition duration-200"
        >
          <span className="flex items-center gap-1">
            {expanded ? "Voir moins" : "Voir plus"}
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </span>
        </button>
      )}
    </div>
  );
};
