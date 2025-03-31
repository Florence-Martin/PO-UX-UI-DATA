"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  hideAllOption?: boolean;
}

export const UserStorySearchBar = ({
  onFilterChange,
  onSearchChange,
  searchValue = "", // 🔧 correction ici
  hideAllOption = false,
}: UserStorySearchBarProps) => {
  const router = useRouter();
  const [priority, setPriority] = useState("high");

  // 🔁 Debounce pour limiter les appels de recherche
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);

    return () => clearTimeout(delay);
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(searchValue); // 🔄 garde le champ synchro si modif externe
  }, [searchValue]);

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    if (value === "all") {
      router.push("/user-stories");
    } else {
      onFilterChange(value);
    }
  };

  const handleReset = () => {
    setPriority("high");
    setLocalSearch("");
    onFilterChange("high");
    onSearchChange?.("");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
      {/* Zone de recherche */}
      <div className="w-full sm:max-w-xs space-y-1">
        <Label htmlFor="search">Rechercher par code ou mot-clé</Label>
        <Input
          id="search"
          placeholder="Ex: US-001, dashboard, persona..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Filtre + reset */}
      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="priority">Filtrer par priorité</Label>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
              {!hideAllOption && (
                <SelectItem value="all">Toutes (page dédiée)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Bouton Réinitialiser */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
