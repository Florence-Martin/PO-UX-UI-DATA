"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, PencilLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { UserStory } from "@/lib/types/userStory";

import { Button } from "./button";

type Props = {
  story: UserStory;
};

export function UserStoryCard({ story }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTargeted] = useState(
    () =>
      typeof window !== "undefined" && window.location.hash.slice(1) === story.id
  );
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isTargeted) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isTargeted]);

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

        {/* Badge de priorité */}
        <div className="sm:self-start">
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
      <div className="text-sm text-yellow-500 flex items-center gap-1 mt-3">
        ⭐{" "}
        <span className="text-foreground font-medium">
          {story.storyPoints} pts
        </span>
      </div>

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
