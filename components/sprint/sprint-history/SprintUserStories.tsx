import { useState, useRef, useEffect } from "react";
import { Tags } from "lucide-react";

export function SprintUserStories({
  sprintUserStories,
}: {
  sprintUserStories: string[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [sprintUserStories]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center text-sm font-medium text-muted-foreground">
        <Tags className="w-4 h-4 mr-1" />
        US livrées
      </div>

      <ul
        ref={listRef}
        className={`flex flex-col gap-1 pr-1 custom-scroll transition-all ${
          showAll
            ? "max-h-[500px]"
            : "max-h-[72px] min-h-[72px] overflow-y-auto"
        }`}
      >
        {sprintUserStories.length > 0 ? (
          sprintUserStories.map((us, i) => (
            <li
              key={i}
              className="bg-muted px-3 py-1 text-xs text-muted-foreground rounded-md truncate"
              title={us}
            >
              {us}
            </li>
          ))
        ) : (
          <li className="text-xs italic text-muted-foreground min-h-[40px]">
            Aucune User Story livrée.
          </li>
        )}
      </ul>

      {/* Bouton voir plus / moins */}
      {isOverflowing && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="self-start text-xs text-primary hover:underline mt-1"
        >
          {showAll ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
