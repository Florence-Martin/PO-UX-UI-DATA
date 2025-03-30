"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { UserStorySearchBar } from "@/components/searchbar/UserStorySearchBar";
import Link from "next/link";
import { UserStoryCard } from "@/components/ui/UserStoryCard";

export default function UserStoriesPage() {
  const { filteredStories, filterByPriority } = useUserStories();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href="/analysis"
        className="inline-flex items-center text-sm text-primary hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l’analyse produit
      </Link>
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Toutes les User Stories
          </CardTitle>

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
    </div>
  );
}
