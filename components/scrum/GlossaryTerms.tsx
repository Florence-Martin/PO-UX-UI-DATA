"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import glossaryData from "@/data/glossaryTerms.json";
import GlossarySearchInput from "../searchbar/GlossarySearchInput.";

export default function GlossaryTerms() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = glossaryData.filter((item) =>
    item.term.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <GlossarySearchInput search={search} setSearch={setSearch} />

      <div className="grid gap-4">
        {filteredData.map((item, index) => (
          <Card
            key={item.term}
            className="bg-muted"
            onMouseEnter={() => setExpandedIndex(null)}
          >
            <CardContent className="p-4">
              <p className="text-lg font-semibold">🔹 {item.term}</p>
              <p
                className={`text-muted-foreground text-sm mt-1 ${
                  expandedIndex === index
                    ? ""
                    : "line-clamp-2 md:line-clamp-none"
                }`}
              >
                {item.definition}
              </p>
              {expandedIndex !== index && (
                <button
                  onClick={() => setExpandedIndex(index)}
                  className="mt-1 text-xs text-[#2196F3] underline md:hidden"
                >
                  Lire plus
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
