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
      className={`border rounded-xl p-3 sm:p-4 shadow-sm bg-card flex flex-col gap-3 ${
        sprint.status === "done"
          ? "opacity-75 border-green-200 bg-green-50/50"
          : isExpired
            ? "border-orange-200 bg-orange-50/50"
            : ""
      }`}
    >
      {/* En-tête avec titre et badges */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-bold text-lg truncate pr-2">{sprint.title}</h3>
            <div className="flex gap-2 flex-wrap">
              {sprint.status === "done" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 text-xs"
                >
                  Terminé
                </Badge>
              )}
              {isExpired && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 text-xs"
                >
                  À clôturer
                </Badge>
              )}
            </div>
          </div>

          {/* Dates */}
          <p className="text-sm text-muted-foreground mt-1 break-words">
            <span className="block sm:inline">
              Du{" "}
              {format(getDate(sprint.startDate), "dd MMM yyyy", {
                locale: fr,
              })}
            </span>
            <span className="block sm:inline sm:before:content-[' '] before:content-['']">
              au{" "}
              {format(getDate(sprint.endDate), "dd MMM yyyy", {
                locale: fr,
              })}
            </span>
          </p>

          {sprint.closedAt && (
            <p className="text-xs text-green-600 font-medium mt-1 break-words">
              Clôturé le{" "}
              {format(getDate(sprint.closedAt), "dd MMM yyyy à HH:mm", {
                locale: fr,
              })}
            </p>
          )}
        </div>

        {/* Boutons d'action - responsive */}
        <div className="flex flex-row sm:flex-row gap-2 flex-wrap justify-start sm:justify-end">
          {/* Bouton d'audit pour les sprints qui ont besoin d'être clôturés */}
          {needsAudit && (
            <Link href={`/sprint-audit?sprintId=${sprint.id}`}>
              <Button variant="secondary" size="sm" className="text-xs">
                <ClipboardCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Audit DoD</span>
                <span className="sm:hidden">Audit</span>
              </Button>
            </Link>
          )}

          {/* Boutons de modification et suppression seulement pour les sprints non terminés */}
          {sprint.status !== "done" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(sprint)}
                className="p-2"
              >
                <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sr-only">Modifier</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="p-2">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="sr-only">Supprimer</span>
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
