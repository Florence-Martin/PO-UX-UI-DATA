"use client";

import { UserStory } from "@/lib/types/userStory";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Assurez-vous que le composant Link est importé
import { Button } from "./button";
import { PencilLine } from "lucide-react";

type Props = {
  story: UserStory;
};

export function UserStoryCard({ story }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTargeted, setIsTargeted] = useState(false);

  // Check si l'URL contient un hash (#id)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === story.id) {
      setIsTargeted(true);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [story.id]);

  return (
    <motion.div
      ref={ref}
      id={story.id}
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
        {/* Partie gauche : Code + Titre */}
        <div className="flex flex-col">
          {story.code && (
            <span className="text-muted-foreground text-sm">{story.code}</span>
          )}
          <h3 className="text-base font-semibold text-foreground">
            {story.title}
          </h3>
        </div>

        {/* Badge de priorité à droite en sm+ */}
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

      <p className="text-sm text-muted-foreground italic">
        {story.description}
      </p>

      <div className="text-sm text-yellow-500 flex items-center gap-1 mt-3">
        ⭐{" "}
        <span className="text-foreground font-medium">
          {story.storyPoints} pts
        </span>
      </div>

      <p className="text-sm text-foreground whitespace-pre-line mt-2">
        {story.acceptanceCriteria}
      </p>

      {isTargeted && (
        <div className="mt-4 flex justify-end">
          <Link href="/analysis?tab=documentation#user-stories-list" passHref>
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
