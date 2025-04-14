"use client";

import { useEffect, useState } from "react";
import { PriorityFilterSelect } from "./PriorityFilterSelect";
import { SearchUserStoryInput } from "./SearchUserStoryInput";
import { MoscowFilterSelect } from "./MoscowFilterSelect";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  onMoscowFilterChange: (moscow: string) => void;
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
  const [moscowFilter, setMoscowFilter] = useState("all");

  // Déclenche le changement de priorité
  useEffect(() => {
    onFilterChange(prioritySearch);
  }, [prioritySearch, onFilterChange]);

  // Déclenche le changement de recherche
  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchChange?.(userStorySearch.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(debounce);
  }, [userStorySearch, onSearchChange]);

  const handleResetSearch = () => {
    setUserStorySearch("");
    onSearchChange?.(""); // Réinitialise la recherche
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
      {/* Input de recherche à gauche */}
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
          onMoscowFilterChange={onMoscowFilterChange}
          onSearchChange={setUserStorySearch}
        />
      </div>
    </div>
  );
};
