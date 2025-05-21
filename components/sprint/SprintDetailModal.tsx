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
import { Timestamp } from "firebase/firestore";
import { Button } from "../ui/button";
import { useSprintDetail, useSprints } from "@/hooks/sprint";

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
  const { refetch } = useSprints();
  const {
    isCreating,
    titleRef,
    startDateRef,
    endDateRef,
    showStoryList,
    setShowStoryList,
    searchTerm,
    setSearchTerm,
    edited,
    toggleUserStorySelection,
    handleSubmit,
    usedUserStoryIds,
    filteredStories,
  } = useSprintDetail(sprint, userStories, onClose, refetch);

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
              placeholder="Exemple : Sprint 24 - Avril"
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              🎯 Objectif du sprint
            </label>
            <input
              type="text"
              defaultValue={sprint?.goal || ""}
              placeholder="Exemple : Améliorer la performance de l'application"
              className="w-full border rounded p-2"
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
