"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp } from "firebase/firestore";
import { UserStory } from "@/lib/types/userStory";

type Props = {
  sprint: Sprint;
  userStories: UserStory[];
  onEdit: (sprint: Sprint) => void;
  onDelete: (id: string) => void;
};

export function SprintPlanningCard({
  sprint,
  userStories,
  onEdit,
  onDelete,
}: Props) {
  const getDate = (value: Date | Timestamp): Date =>
    value instanceof Timestamp ? value.toDate() : value;

  const linkedStories = userStories.filter(
    (story) => story.sprintId === sprint.id
  );

  const velocity = linkedStories.reduce(
    (acc, story) => acc + (story.storyPoints || 0),
    0
  );

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-card flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{sprint.title}</h3>
          <p className="text-sm text-muted-foreground">
            Du{" "}
            {format(getDate(sprint.startDate), "dd MMMM yyyy", {
              locale: fr,
            })}{" "}
            au{" "}
            {format(getDate(sprint.endDate), "dd MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(sprint)}>
            <Pencil className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce sprint ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Êtes-vous sûr(e) ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(sprint.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <p className="text-sm">
        📌 {linkedStories.length} User Stories • {velocity} points
      </p>
    </div>
  );
}
