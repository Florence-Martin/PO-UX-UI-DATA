"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

type MoscowType =
  | "mustHave"
  | "shouldHave"
  | "couldHave"
  | "wontHave"
  | "unprioritized"
  | "all";

interface MoscowFilterSelectProps {
  onMoscowFilterChange: (priority: MoscowType) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export const MoscowFilterSelect = ({
  onMoscowFilterChange,
  onSearchChange,
  searchValue = "",
}: MoscowFilterSelectProps) => {
  const [moscowFilter, setMoscowFilter] = useState<MoscowType>("all");
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);
    return () => clearTimeout(delay);
  }, [localSearch]);

  const handleMoscowChange = (value: MoscowType) => {
    setMoscowFilter(value);
    onMoscowFilterChange(value);
  };

  const handleReset = () => {
    setMoscowFilter("all");
    setLocalSearch("");
    onMoscowFilterChange("all");
    onSearchChange?.("");
  };

  return (
    <div className="flex sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto sm:justify-between">
      <div className="w-full sm:w-auto">
        <Label htmlFor="moscow-priority-select" className="sr-only">
          Filtrer par priorité MoSCoW
        </Label>
        <Select
          value={moscowFilter}
          onValueChange={handleMoscowChange}
          aria-label="Filtrer les user stories par priorité MoSCoW"
        >
          <SelectTrigger
            id="moscow-priority-select"
            className="w-[180px] text-sm"
            aria-describedby="moscow-priority-hint"
          >
            {moscowFilter === "all" ? (
              <span className="text-muted-foreground">Ex: must have...</span>
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mustHave">Must Have</SelectItem>
            <SelectItem value="shouldHave">Should Have</SelectItem>
            <SelectItem value="couldHave">Could Have</SelectItem>
            <SelectItem value="wontHave">Won’t Have</SelectItem>
            <SelectItem value="unprioritized">Non priorisée</SelectItem>
          </SelectContent>
        </Select>
        <span id="moscow-priority-hint" className="sr-only">
          Choisissez une priorité pour filtrer les user stories.
        </span>
      </div>

      <Button
        variant="outline"
        onClick={handleReset}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition w-full sm:w-auto sm:ml-auto"
        aria-label="Réinitialiser le filtre MoSCoW"
        aria-describedby="reset-button-hint"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};
