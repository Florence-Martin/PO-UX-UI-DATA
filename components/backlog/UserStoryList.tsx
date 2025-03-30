"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { UserStorySearchBar } from "@/components/searchbar/UserStorySearchBar";

export function UserStoryList() {
  const { filteredStories, filterByPriority } = useUserStories();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <UserStorySearchBar onFilterChange={filterByPriority} hideAllOption />
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
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {story.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
