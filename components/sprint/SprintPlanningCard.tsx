"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { ClipboardCheck, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  sprint: Sprint;
  userStories: UserStory[];
  onEdit: (sprint: Sprint) => void;
  onDelete: (id: string) => void;
  onView?: (sprint: Sprint) => void;
};

export function SprintPlanningCard({
  sprint,
  userStories,
  onEdit,
  onDelete,
  onView,
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

  // Vérifier si le sprint est expiré (date de fin dépassée)
  const isExpired =
    getDate(sprint.endDate) < new Date() && sprint.status !== "done";

  // Vérifier si le sprint a besoin d'un audit DoD
  const needsAudit = sprint.status !== "done" && linkedStories.length > 0;

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm bg-card flex flex-col gap-2 ${
        sprint.status === "done"
          ? "opacity-75 border-green-200 bg-green-50/50"
          : isExpired
          ? "border-orange-200 bg-orange-50/50"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{sprint.title}</h3>
            {sprint.status === "done" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Terminé
              </Badge>
            )}
            {isExpired && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                À clôturer
              </Badge>
            )}
          </div>
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
          {sprint.closedAt && (
            <p className="text-xs text-green-600 font-medium">
              Clôturé le{" "}
              {format(getDate(sprint.closedAt), "dd MMMM yyyy à HH:mm", {
                locale: fr,
              })}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {/* Bouton d'audit pour les sprints qui ont besoin d'être clôturés */}
          {needsAudit && (
            <Link href={`/sprint-audit?sprintId=${sprint.id}`}>
              <Button variant="secondary" size="sm">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Audit DoD
              </Button>
            </Link>
          )}

          {/* Boutons de modification et suppression seulement pour les sprints non terminés */}
          {sprint.status !== "done" ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(sprint)}
              >
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
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onView?.(sprint)}
              title="Visualiser le sprint"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm">
        📌 {linkedStories.length} User Stories • {velocity} points
      </p>
    </div>
  );
}
