"use client";

import { useEffect, useState } from "react";
import { PriorityFilterSelect } from "./PriorityFilterSelect";
import { SearchUserStoryInput } from "./SearchUserStoryInput";
import { MoscowFilterSelect } from "./MoscowFilterSelect";

type MoscowType =
  | "mustHave"
  | "shouldHave"
  | "couldHave"
  | "wontHave"
  | "unprioritized"
  | "all";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  onMoscowFilterChange?: (moscow: MoscowType) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export const UserStorySearchBar = ({
  onFilterChange,
  onMoscowFilterChange,
  onSearchChange,
  searchValue = "",
}: UserStorySearchBarProps) => {
  const [prioritySearch, setPrioritySearch] = useState("all");
  const [userStorySearch, setUserStorySearch] = useState(searchValue);
  const [moscowFilter, setMoscowFilter] = useState<MoscowType>("all");

  // Déclenche le changement de priorité
  useEffect(() => {
    onFilterChange(prioritySearch);
  }, [prioritySearch, onFilterChange]);

  // Déclenche le changement MoSCoW (si fourni)
  useEffect(() => {
    if (onMoscowFilterChange) {
      onMoscowFilterChange(moscowFilter);
    }
  }, [moscowFilter, onMoscowFilterChange]);

  // Déclenche la recherche
  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange?.(userStorySearch.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(debounce);
  }, [userStorySearch, onSearchChange]);

  const handleResetSearch = () => {
    setUserStorySearch("");
    onSearchChange?.("");
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
      {/* Zone de recherche à gauche */}
      <div className="w-full md:max-w-md">
        <SearchUserStoryInput
          value={userStorySearch}
          onChange={(e) => setUserStorySearch(e.target.value)}
          onReset={handleResetSearch}
        />
      </div>

      {/* Filtres à droite */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
        <PriorityFilterSelect
          onFilterChange={setPrioritySearch}
          onSearchChange={onSearchChange}
        />
        <MoscowFilterSelect
          onMoscowFilterChange={setMoscowFilter}
          onSearchChange={setUserStorySearch}
          searchValue={userStorySearch}
        />
      </div>
    </div>
  );
};
