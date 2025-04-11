import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UserStory } from "@/lib/types/userStory";
import { PrioritisedUserStoryCard } from "./PrioritisedUserStoryCard";

type Props = {
  label: string;
  stories: UserStory[];
};

export function MoscowColumn({ label, stories }: Props) {
  return (
    <div className="border p-4 rounded bg-card">
      <h3 className="text-lg font-bold capitalize mb-2">{label}</h3>
      {stories.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          Aucune User Story
        </p>
      ) : (
        <SortableContext
          id={label}
          items={stories.map((story) => story.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {stories.map((story) => (
              <PrioritisedUserStoryCard key={story.id} story={story} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
