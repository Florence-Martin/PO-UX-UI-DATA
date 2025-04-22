"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { createSprint, updateSprint } from "@/lib/services/sprintService";
import { Timestamp } from "firebase/firestore";
import { Button } from "../ui/button";
import { updateUserStorySprint } from "@/lib/services/userStoryService";
import { useSprints } from "@/hooks/useSprints";

const getDate = (value: Date | Timestamp): Date =>
  value instanceof Timestamp ? value.toDate() : value;

type Props = {
  sprint: Sprint | null;
  userStories: UserStory[];
  open: boolean;
  onClose: () => void;
};

export function SprintDetailModal({
  sprint,
  userStories,
  open,
  onClose,
}: Props) {
  const isCreating = sprint === null;

  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [showStoryList, setShowStoryList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [edited, setEdited] = useState<{ userStoryIds: string[] }>({
    userStoryIds: [],
  });
  const { refetch } = useSprints();

  useEffect(() => {
    if (sprint) {
      setEdited({
        userStoryIds: userStories
          .filter((us) => us.sprintId === sprint.id)
          .map((us) => us.id),
      });
    }
  }, [sprint, userStories]);

  const toggleUserStorySelection = (storyId: string) => {
    setEdited((prev) => ({
      userStoryIds: prev.userStoryIds.includes(storyId)
        ? prev.userStoryIds.filter((id) => id !== storyId)
        : [...prev.userStoryIds, storyId],
    }));
  };

  const usedUserStoryIds = userStories
    .filter((us) => us.sprintId && us.sprintId !== sprint?.id)
    .map((us) => us.id);

  const filteredStories = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value.trim() || "";
    const startDateStr = startDateRef.current?.value;
    const endDateStr = endDateRef.current?.value;

    if (!title || !startDateStr || !endDateStr) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate > endDate) {
      toast.error("La date de début doit être antérieure à la date de fin.");
      return;
    }

    try {
      if (isCreating) {
        const newSprintId = await createSprint({
          title,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          userStoryIds: edited.userStoryIds,
          velocity: 0,
        });

        for (const storyId of edited.userStoryIds) {
          await updateUserStorySprint(storyId, newSprintId);
        }

        toast.success("Sprint créé avec succès !");
      } else {
        // Mettre à jour le Sprint lui-même (titre, dates, userStoryIds)
        await updateSprint(sprint.id, {
          title,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          userStoryIds: edited.userStoryIds,
        });

        // Puis mettre à jour chaque user story
        for (const story of userStories) {
          const shouldBeLinked = edited.userStoryIds.includes(story.id);
          const alreadyLinked = story.sprintId === sprint.id;

          if (shouldBeLinked && !alreadyLinked) {
            await updateUserStorySprint(story.id, sprint.id);
          } else if (!shouldBeLinked && alreadyLinked) {
            await updateUserStorySprint(story.id, null);
          }
        }

        toast.success("Sprint modifié avec succès !");
      }

      await refetch(); // met à jour l’interface automatiquement
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du sprint", err);
      toast.error("Erreur lors de l'enregistrement du sprint.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isCreating
              ? "Créer un nouveau sprint"
              : `Détails du sprint ${sprint?.title}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-sm font-medium">Nom du sprint</label>
            <input
              ref={titleRef}
              defaultValue={sprint?.title || ""}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date de début</label>
            <input
              ref={startDateRef}
              type="date"
              defaultValue={
                sprint ? format(getDate(sprint.startDate), "yyyy-MM-dd") : ""
              }
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date de fin</label>
            <input
              ref={endDateRef}
              type="date"
              defaultValue={
                sprint ? format(getDate(sprint.endDate), "yyyy-MM-dd") : ""
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              User Stories à inclure
            </label>

            {/* {edited.userStoryIds.length > 0 && (
              <ul className="list-disc ml-4 text-muted-foreground mb-2 space-y-1">
                {userStories
                  .filter((us) => edited.userStoryIds.includes(us.id))
                  .map((us) => (
                    <li key={us.id}>
                      <Link
                        href={`/backlog?tab=user-stories#${us.id}`}
                        className="text-primary hover:underline"
                      >
                        [{us.code}] - {us.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            )} */}
            {edited.userStoryIds.length > 0 && (
              <div className="mb-2 space-y-2">
                {userStories
                  .filter((us) => edited.userStoryIds.includes(us.id))
                  .map((us) => (
                    <label
                      key={us.id}
                      className="flex items-center space-x-2 text-sm text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleUserStorySelection(us.id)}
                      />
                      <Link
                        href={`/backlog?tab=user-stories#${us.id}`}
                        className="text-primary hover:underline"
                      >
                        [{us.code}] - {us.title}
                      </Link>
                    </label>
                  ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowStoryList(!showStoryList)}
              className="text-xs underline text-primary flex items-center gap-1 mb-2"
            >
              {showStoryList ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {showStoryList ? "Masquer" : "Afficher la liste"}
            </button>

            {showStoryList && (
              <>
                <input
                  type="text"
                  placeholder="Filtrer par titre ou code..."
                  className="w-full mb-2 px-2 py-1 border rounded text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                  {filteredStories.map((story) => {
                    const isUsedElsewhere =
                      usedUserStoryIds.includes(story.id) &&
                      !edited.userStoryIds.includes(story.id);

                    return (
                      <label
                        key={story.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={edited.userStoryIds.includes(story.id)}
                          onChange={() => toggleUserStorySelection(story.id)}
                        />
                        <span
                          className={
                            isUsedElsewhere ? "line-through opacity-70" : ""
                          }
                        >
                          [{story.code}] - {story.title}
                          {isUsedElsewhere && (
                            <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                              Déjà liée à un autre sprint
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="border border-gray-300"
            >
              Annuler
            </Button>

            <Button type="submit">{isCreating ? "Créer" : "Modifier"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
