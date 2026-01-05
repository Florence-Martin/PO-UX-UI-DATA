"use client";

import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { updateUserStory } from "@/lib/services/userStoryService";
import { DoDItem } from "@/lib/types/dod";
import { UserStory } from "@/lib/types/userStory";
import { motion } from "framer-motion";
import { PencilLine, Pin, PinOff, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExpandableSection } from "../backlog/ExpandableSection";
import { Button } from "../ui/button";
import { UserStoryDoDFlexible } from "../user-story/UserStoryDoD";

type Props = {
  story: UserStory;
  hideDoD?: boolean; // Masquer la DoD (pour vue Backlog)
};

export function UserStoryCard({ story, hideDoD = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTargeted, setIsTargeted] = useState(false);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [moscow, setMoscow] = useState<string>(story.moscow || "");

  const isTitleLong = story.title?.length > 50;
  const isDescriptionLong = story.description?.length > 160;
  // Critères d'acceptation : toujours afficher "read more" s'il y a du contenu > 50 caractères ou plusieurs lignes
  const isAcceptanceCriteriaLong =
    (story.acceptanceCriteria?.length ?? 0) > 50 ||
    (story.acceptanceCriteria?.split("\n").length ?? 0) > 2;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === story.id) {
      setIsTargeted(true);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [story.id]);

  // Récupère les tâches liées à la User Story
  useEffect(() => {
    const fetchLinkedTasks = async () => {
      if (!story.id) return;

      const allTasks = await getAllBacklogTasks();
      const tasksForStory = allTasks.filter((task) =>
        task.userStoryIds?.includes(story.id as string)
      );

      setLinkedTasks(tasksForStory);
    };

    fetchLinkedTasks();
  }, [story.id]);

  // Met à jour la priorité de la User Story
  const handleMoscowChange = async (newValue: string) => {
    try {
      setMoscow(newValue); // Met à jour l'état local
      if (story.id) {
        await updateUserStory(story.id, {
          moscow: newValue as UserStory["moscow"],
        }); // Met à jour dans Firebase
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la priorisation MoSCoW :",
        error
      );
    }
  };

  // 🆕 Met à jour la DoD de la User Story
  const handleDoDUpdate = async (newDoDItems: DoDItem[]) => {
    try {
      if (story.id) {
        await updateUserStory(story.id, {
          dodItems: newDoDItems,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la DoD :", error);
    }
  };

  return (
    <motion.div
      ref={ref}
      id={`us-${story.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-background rounded-xl p-4 border transition-shadow ${
        isTargeted
          ? "border-primary ring-2 ring-primary/40 shadow-lg"
          : "border-border shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2 min-h-[100px]">
        {/* Code + titre */}
        <div className="flex flex-col">
          {story.code && (
            <span className="text-muted-foreground text-sm">{story.code}</span>
          )}
          <ExpandableSection
            content={story.title}
            isLong={isTitleLong}
            clampClass="line-clamp-2"
          />
        </div>

        {/* Badges priorité + MoSCoW */}
        <div className="flex flex-row sm:flex-col sm:items-end gap-2">
          {/* Badge de priorité */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit
              ${
                story.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : story.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
          >
            {story.priority}
          </span>

          {/* Select inline MoSCoW stylisé comme un badge */}
          <select
            value={moscow}
            onChange={(e) => handleMoscowChange(e.target.value)}
            className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit border-none outline-none appearance-none bg-opacity-80 cursor-pointer
              ${
                moscow === "mustHave"
                  ? "bg-green-100 text-green-700"
                  : moscow === "shouldHave"
                    ? "bg-yellow-100 text-yellow-700"
                    : moscow === "couldHave"
                      ? "bg-blue-100 text-blue-700"
                      : moscow === "wontHave"
                        ? "bg-gray-200 text-gray-500"
                        : "bg-muted text-muted-foreground"
              }`}
          >
            <option value="">Non priorisée</option>
            <option value="mustHave">Must Have</option>
            <option value="shouldHave">Should Have</option>
            <option value="couldHave">Could Have</option>
            <option value="wontHave">Won’t Have</option>
          </select>
        </div>
      </div>

      {/* Trait horizontal */}
      <hr className="border-t border-border my-3" />

      <div className="flex flex-col justify-between min-h-[100px]">
        {/* Zone de texte (expandable) */}
        <ExpandableSection
          content={story.description}
          isLong={isDescriptionLong}
          clampClass="line-clamp-2 text-muted-foreground italic transition-all"
          fullClass="text-muted-foreground italic transition-all"
        />

        {/* Points alignés en bas */}
        <div className="mt-auto pt-2 flex justify-end items-center text-sm text-yellow-500 gap-1">
          ⭐{" "}
          <span className="text-foreground font-medium">
            {story.storyPoints} pts
          </span>
        </div>
      </div>

      {/* Trait horizontal */}
      <hr className="border-t border-border my-3" />

      {/* 🔗 Tâches liées */}
      {linkedTasks.length > 0 ? (
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-sm">Tâches liées :</p>
          {linkedTasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-start border-b pb-2 mb-2"
            >
              <span className="font-medium text-[11px] tracking-wide flex items-center gap-1">
                <Pin className="w-3 h-3 text-red-500" />
                <span>{task.title}</span>
              </span>
              <Link
                href={`/sprint?tab=kanban#${task.id}`}
                title="Voir la tâche dans le Kanban"
                className="text-muted-foreground hover:text-primary"
                scroll={false}
              >
                <SquareArrowOutUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-red-500 italic flex items-center gap-1">
          <PinOff className="w-3 h-3" />
          Aucune tâche liée
        </div>
      )}

      {/* Critères d'acceptation */}
      <ExpandableSection
        label="Critères d'acceptation"
        content={story.acceptanceCriteria || ""}
        isLong={true}
        clampClass="line-clamp-3"
        fullClass="text-muted-foreground italic transition-all"
      />

      {/* 🆕 Definition of Done - Masquée dans le Backlog */}
      {!hideDoD && story.dodItems && story.dodItems.length > 0 && (
        <div className="mt-4 p-3 border rounded-lg bg-muted/30">
          <UserStoryDoDFlexible
            dodItems={story.dodItems}
            onUpdate={handleDoDUpdate}
            readOnly={false}
            showPercentage={true}
          />
        </div>
      )}

      {/* Bouton modifier */}
      {isTargeted && (
        <div className="mt-4 flex justify-end">
          <Link
            href={`/analysis?tab=documentation&edit=${story.id}#us-${story.id}`}
            passHref
          >
            <Button variant="outline" size="sm">
              <PencilLine className="w-4 h-4 mr-2" />
              Modifier cette User Story
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
