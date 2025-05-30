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

interface PriorityFilterSelectProps {
  onFilterChange: (priority: string) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export const PriorityFilterSelect = ({
  onFilterChange,
  onSearchChange,
  searchValue = "",
}: PriorityFilterSelectProps) => {
  const [priority, setPriority] = useState("all");
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    onFilterChange(priority);
  }, [priority]);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);
    return () => clearTimeout(delay);
  }, [localSearch]);

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    onFilterChange(value);
  };

  const handleReset = () => {
    setPriority("all");
    setLocalSearch("");
    onFilterChange("all");
    onSearchChange?.("");
  };

  return (
    <>
      {/* Filtre + reset */}
      <div className="flex sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto sm:justify-between">
        <div className="w-full sm:w-auto">
          <Label htmlFor="priority" className="sr-only">
            Filtrer par priorité
          </Label>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[180px] text-sm">
              {priority === "all" ? (
                <span className="text-muted-foreground">Ex: high...</span>
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="all">Toute</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton Réinitialiser */}
        <Button
          variant={"outline"}
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition w-full sm:w-auto sm:ml-2"
          aria-label="Réinitialiser les filtres"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
};
