"use client";

import { useState } from "react";
import { glossary } from "@/data/scrumGlossary";
import type { GlossaryItem } from "@/data/scrumGlossary";
import { GlossaryPhases } from "@/lib/glossaryPhases";
import GlossarySearchInput from "../searchbar/GlossarySearchInput.";
import GlossaryCard from "../glossary/GlossaryCard";
import GlossaryPhaseFilter from "../searchbar/GlossaryPhaseFilter";

export default function GlossaryTerms() {
  const [search, setSearch] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<GlossaryPhases | null>(
    null
  );

  const filteredData = glossary.filter((item) => {
    const matchesSearch = [item.term, item.definition, item.phase].some(
      (field) => field.toLowerCase().includes(search.toLowerCase())
    );
    const matchesPhase = selectedPhase ? item.phase === selectedPhase : true;

    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <GlossarySearchInput search={search} setSearch={setSearch} />

      {/* Filtre par phase */}
      <GlossaryPhaseFilter
        selectedPhase={selectedPhase}
        onSelect={setSelectedPhase}
      />

      {/* Cartes filtrées */}
      <div className="grid gap-4">
        {filteredData.map((item: GlossaryItem) => (
          <GlossaryCard key={item.term} item={item} />
        ))}
      </div>
    </div>
  );
}
