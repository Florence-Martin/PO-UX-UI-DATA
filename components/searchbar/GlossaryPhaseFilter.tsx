"use client";

import { cn } from "@/lib/utils";
import {
  GlossaryPhases,
  Phases,
  phaseTextColorMap,
} from "@/lib/glossaryPhases";

type Props = {
  selectedPhase: GlossaryPhases | null;
  onSelect: (phase: GlossaryPhases | null) => void;
};

export default function GlossaryPhaseFilter({
  selectedPhase,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "text-xs px-3 py-1 rounded-full border transition",
          selectedPhase === null
            ? "bg-primary text-muted-foreground"
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        Toutes les phases
      </button>

      {Phases.map((phase) => (
        <button
          key={phase}
          onClick={() => onSelect(phase)}
          className={cn(
            "text-xs px-3 py-1 rounded-full border transition",
            selectedPhase === phase
              ? `${phaseTextColorMap[phase]} bg-muted font-semibold`
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {phase}
        </button>
      ))}
    </div>
  );
}
