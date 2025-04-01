"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { UserStorySearchBar } from "@/components/searchbar/UserStorySearchBar";
import { useEffect } from "react";

export function UserStoryList() {
  const { filteredStories, filterByPriority, searchTerm, setSearchTerm } =
    useUserStories();

  // Juste avant le rendu des user stories
  useEffect(() => {
    const hash = window.location.hash.slice(1); // "us-005"
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "animate-pulse");

        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary", "animate-pulse");
        }, 3000);
      }
    }
  }, []);

  return (
    <div id="user-stories-list" className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="w-5 h-5" />
            User Stories existantes
          </CardTitle>

          <UserStorySearchBar
            onFilterChange={filterByPriority}
            onSearchChange={setSearchTerm}
            hideAllOption={false}
            searchValue={searchTerm} // 👈 ajouté pour contrôle du champ
          />
        </CardHeader>

        <CardContent>
          {filteredStories.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Aucune user story pour le moment.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-2 sm:mb-3">
                    {story.code && (
                      <div className="text-xs text-muted-foreground font-mono tracking-wide mb-1">
                        {story.code}
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-foreground leading-snug">
                      {story.title}
                    </h3>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        story.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : story.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {story.priority}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    {story.description}
                  </p>

                  <div className="text-sm text-yellow-500 flex items-center gap-1 mt-3">
                    ⭐{" "}
                    <span className="text-foreground font-medium">
                      {story.storyPoints} pts
                    </span>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-line mt-2">
                    {story.acceptanceCriteria}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
