"use client";

import { useEffect, useState } from "react";
import { PriorityFilterSelect } from "./PriorityFilterSelect";
import { SearchUserStoryInput } from "./SearchUserStoryInput";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export const UserStorySearchBar = ({
  onFilterChange,
  onSearchChange,
  searchValue = "",
}: UserStorySearchBarProps) => {
  const [prioritySearch, setPrioritySearch] = useState("all");
  const [userStorySearch, setUserStorySearch] = useState(searchValue);

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
      <div className="w-full md:max-w-md">
        <SearchUserStoryInput
          value={userStorySearch}
          onChange={(e) => setUserStorySearch(e.target.value)}
          onReset={handleResetSearch}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <PriorityFilterSelect
          onFilterChange={setPrioritySearch}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  );
};
