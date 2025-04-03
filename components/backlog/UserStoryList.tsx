"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { UserStorySearchBar } from "@/components/searchbar/UserStorySearchBar";
import { UserStoryCard } from "@/components/ui/UserStoryCard";

export function UserStoriesList() {
  const { filteredStories, filterByPriority } = useUserStories();

  return (
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
              <UserStoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
