import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type ExpandableSectionProps = {
  content: string;
  isLong: boolean;
  clampClass: string;
};

export const ExpandableSection = ({
  content,
  isLong,
  clampClass,
}: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p
        className={`transition-all ${isExpanded || !isLong ? "" : clampClass}`}
      >
        {content}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-medium text-blue-500 hover:underline transition duration-200"
        >
          <span className="flex items-center gap-1">
            {isExpanded ? "Voir moins" : "Voir plus"}
            {isExpanded ? (
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
