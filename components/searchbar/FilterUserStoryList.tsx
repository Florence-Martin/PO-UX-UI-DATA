"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface FilterUserStoryListProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterUserStoryList = ({
  value,
  onChange,
}: FilterUserStoryListProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const delay = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(delay);
  }, [localValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleReset = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor="filter-us">Filtrer les user stories</Label>
      <div className="flex gap-2 items-center">
        <Input
          id="filter-us"
          placeholder="Ex: US-005, dashboard, persona..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="text-sm"
        />
        <Button
          type="button"
          onClick={handleReset}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};
