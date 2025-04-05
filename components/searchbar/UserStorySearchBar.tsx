"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PriorityFilterSelect } from "./PriorityFilterSelect";
import { SearchUserStoryInput } from "./SearchUserStoryInput";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  hideAllOption?: boolean;
}

export const UserStorySearchBar = ({
  onFilterChange,
  onSearchChange,
  searchValue = "",
  hideAllOption = false,
}: UserStorySearchBarProps) => {
  const [priority, setPriority] = useState("medium");
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Synchronise `localSearch` avec `searchValue` (prop)
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Appelle `onSearchChange` avec un délai (debounce)
  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange?.(localSearch.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(debounce); // Nettoie le timeout précédent
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col md:justify-between md:items-end gap-4 mb-4">
      {/* Partie gauche : Search input */}
      {/* <div className="w-full md:max-w-md">
        <SearchUserStoryInput
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div> */}

      {/* Partie droite : filtre priorité */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <PriorityFilterSelect
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  );
};
