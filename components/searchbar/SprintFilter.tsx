"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

// 🔒 Typage strict des valeurs possibles
export type SprintFilterValue = "all" | "last3" | "last6";

type SprintFilterProps = {
  onChange: (value: SprintFilterValue) => void;
  defaultValue?: SprintFilterValue;
};

export default function SprintFilter({
  onChange,
  defaultValue = "all",
}: SprintFilterProps) {
  const [filter, setFilter] = useState<SprintFilterValue>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SprintFilterValue;
    setFilter(value);
    onChange(value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-4 w-4 text-gray-600" />
      <select
        value={filter}
        onChange={handleChange}
        className="border rounded-md px-2 py-1 text-sm bg-black text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">All sprints</option>
        <option value="last3">Last 3 sprints</option>
        <option value="last6">Last 6 sprints</option>
      </select>
    </div>
  );
}
