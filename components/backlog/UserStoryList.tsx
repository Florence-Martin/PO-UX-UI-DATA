"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserStoryCard } from "@/components/analysis/UserStoryCard";
import { UserStorySearchBar } from "../searchbar/UserStorySearchBar";

export function UserStoriesList() {
  const {
    filteredStories,
    filterByPriority,
    filterByMoscow,
    setUserStorySearchTerm,
  } = useUserStories();

  return (
    <Card className="mt-20 md:mt-0">
      <CardHeader className="space-y-4">
        <UserStorySearchBar
          onFilterChange={filterByPriority}
          onMoscowFilterChange={filterByMoscow}
          onSearchChange={setUserStorySearchTerm}
        />
      </CardHeader>

      <CardContent>
        {filteredStories.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Désolée, mais rien ne correspond à votre recherche!
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
