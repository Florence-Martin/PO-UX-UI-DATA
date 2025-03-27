"use client";

import { useUserStories } from "@/hooks/useUserStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserStoriesPage() {
  const { userStories } = useUserStories();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>📜 Toutes les User Stories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userStories.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Aucune user story pour le moment.
            </p>
          ) : (
            userStories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-md border border-border bg-muted text-muted-foreground"
              >
                <p className="font-medium text-foreground">{story.title}</p>
                <p className="text-sm italic text-muted-foreground">
                  {story.description}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
