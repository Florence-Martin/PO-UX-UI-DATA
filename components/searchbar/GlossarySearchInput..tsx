"use client";

import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

export default function GlossarySearchInput({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un terme du glossaire..."
        className="pl-9 pr-10"
      />

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
