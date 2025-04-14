"use client";

import { UserStory } from "@/lib/types/userStory";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";
import {
  ChevronDown,
  ChevronUp,
  PencilLine,
  Pin,
  PinOff,
  SquareArrowOutUpRight,
} from "lucide-react";
import { getAllBacklogTasks } from "@/lib/services/backlogTasksService";
import { updateUserStory } from "@/lib/services/userStoryService";

type Props = {
  story: UserStory;
};

export function UserStoryCard({ story }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTargeted, setIsTargeted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [moscow, setMoscow] = useState<string>(story.moscow || "");

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
      if (!story.id) return; // ⛔ stop si l'id est undefined

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
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
        {/* Code + titre */}
        <div className="flex flex-col">
          {story.code && (
            <span className="text-muted-foreground text-sm">{story.code}</span>
          )}
          <h3 className="text-base font-semibold text-foreground">
            {story.title}
          </h3>
        </div>

        {/* Badges priorité + MoSCoW */}
        <div className="sm:self-start justify-end flex gap-2 flex-wrap">
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
            <option value="">Non priorisé</option>
            <option value="mustHave">Must Have</option>
            <option value="shouldHave">Should Have</option>
            <option value="couldHave">Could Have</option>
            <option value="wontHave">Won’t Have</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-sm text-muted-foreground italic transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {story.description}
      </p>

      {/* Points */}
      <div className="text-sm justify-end text-yellow-500 flex items-center gap-1 mt-3">
        ⭐{" "}
        <span className="text-foreground font-medium">
          {story.storyPoints} pts
        </span>
      </div>

      {/* 🔗 Tâches liées */}
      {linkedTasks.length > 0 ? (
        <div className="text-xs text-muted-foreground space-y-1 mt-4">
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
                href={`/backlog?tab=kanban#${task.id}`}
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
        <div className="text-xs text-red-500 italic flex items-center gap-1 mt-4">
          <PinOff className="w-3 h-3" />
          Aucune tâche liée
        </div>
      )}

      {/* Critères d’acceptation */}
      <p
        className={`text-sm text-foreground mt-2 whitespace-pre-line transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {story.acceptanceCriteria}
      </p>

      {/* Bouton voir plus / moins */}
      {(story.description.length > 160 ||
        story.acceptanceCriteria.length > 160) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-medium text-blue-500 hover:underline transition duration-200"
        >
          <span className="flex items-center gap-1">
            {expanded ? "Voir moins" : "Voir plus"}
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </span>
        </button>
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
