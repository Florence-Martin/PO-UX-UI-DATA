"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserStorySearchBarProps {
  onFilterChange: (priority: string) => void;
  hideAllOption?: boolean;
}

export const UserStorySearchBar = ({
  onFilterChange,
  hideAllOption = false,
}: UserStorySearchBarProps) => {
  const [priority, setPriority] = useState("high");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setPriority(selected);
    if (selected === "all") {
      router.push("/user-stories");
    } else {
      onFilterChange(selected);
    }
  };

  return (
    <div className="flex justify-end items-center gap-2 mb-4">
      <label
        htmlFor="priority-filter"
        className="text-sm font-medium text-muted-foreground"
      >
        Filtrer par priorité :
      </label>
      <select
        id="priority-filter"
        value={priority}
        onChange={handleChange}
        className="p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
      >
        <option value="high">Haute</option>
        <option value="medium">Moyenne</option>
        <option value="low">Basse</option>
        {!hideAllOption && <option value="all">Toutes (page dédiée)</option>}
      </select>
    </div>
  );
};
