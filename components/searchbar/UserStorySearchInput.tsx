"use client";

import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

interface UserStorySearchInputProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function UserStorySearchInput({
  search,
  setSearch,
}: UserStorySearchInputProps) {
  return (
    <div className="relative max-w-md">
      {/* Icône de recherche */}
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

      {/* Champ de recherche */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher une User Story par titre ou description..."
        className="pl-9 pr-10"
      />

      {/* Bouton pour effacer la recherche */}
      {search.length > 0 && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
