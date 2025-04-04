"use client";

import { useState } from "react";
import { glossary } from "@/data/scrumGlossary";
import type { GlossaryItem } from "@/data/scrumGlossary";
import GlossarySearchInput from "../searchbar/GlossarySearchInput.";
import GlossaryCard from "../glossary/GlossaryCard";
export default function GlossaryTerms() {
  const [search, setSearch] = useState("");

  const filteredData = glossary.filter((item) =>
    [item.term, item.definition, item.phase].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <GlossarySearchInput search={search} setSearch={setSearch} />

      {/* Cartes filtrées */}
      <div className="grid gap-4">
        {filteredData.map((item: GlossaryItem, index) => (
          <GlossaryCard key={item.term} item={item} />
        ))}
      </div>
    </div>
  );
}
