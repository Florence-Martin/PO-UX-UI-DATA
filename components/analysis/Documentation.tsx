"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useUserStories } from "@/hooks/useUserStories";
import { UserStorySearchBar } from "../searchbar/UserStorySearchBar";
import { ArrowDownToDot, List, Notebook } from "lucide-react";
import Link from "next/link";

export function Documentation() {
  const {
    title,
    description,
    priority,
    storyPoints,
    acceptanceCriteria,
    isEditing,
    setTitle,
    setDescription,
    setPriority,
    setStoryPoints,
    setAcceptanceCriteria,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    filteredStories,
    filterByPriority,
  } = useUserStories();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && cardRef.current) {
      const el = cardRef.current;

      // Ajoute une classe focus temporairement
      el.classList.add("ring-2", "ring-primary", "transition-shadow");

      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary");
      }, 3000);
    }
  }, [isEditing]);

  return (
    <div className="grid gap-6 px-4 sm:px-6 lg:px-8">
      {/* Formulaire */}
      <Card id="edit-user-story" ref={cardRef}>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center">
              <Notebook className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-base sm:text-lg">
                Éditeur de User Stories
              </span>
            </div>
            <Link
              href="#user-stories-list"
              className="text-sm text-primary hover:underline flex items-center"
            >
              <ArrowDownToDot className="w-5 h-5 sm:w-6 sm:h-6 mr-1" />
              Liste user stories
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="En tant que [rôle], je veux [action] afin de [bénéfice]"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée de la user story..."
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Story Points</Label>
              <Select
                value={storyPoints?.toString() || ""}
                onValueChange={(val) => setStoryPoints(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estimation" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 8, 13].map((point) => (
                    <SelectItem key={point} value={point.toString()}>
                      {point}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Critères d’Acceptation</Label>
            <Textarea
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="1. Étant donné [contexte], quand [action], alors [résultat attendu]"
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Mettre à jour" : "Sauvegarder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des stories */}
      <Card id="user-stories-list">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">
              User Stories existantes
            </span>
          </CardTitle>
          <UserStorySearchBar onFilterChange={filterByPriority} />
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredStories.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Aucune user story pour le moment. Commencez par en créer une !
            </p>
          ) : (
            filteredStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-md border border-border bg-muted text-muted-foreground"
              >
                <p className="font-medium text-foreground flex items-center gap-2">
                  📄 {story.title}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      story.priority === "high"
                        ? "bg-red-500/10 text-red-500"
                        : story.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {story.priority}
                  </span>
                </p>

                <p className="text-sm italic text-muted-foreground mb-2">
                  {story.description}
                </p>

                <div className="text-sm text-yellow-500 flex items-center gap-1">
                  ⭐{" "}
                  <span className="text-foreground">
                    {story.storyPoints} points
                  </span>
                </div>

                <p className="text-sm text-foreground whitespace-pre-line mt-2">
                  {story.acceptanceCriteria}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleEdit(story);

                      const form = document.getElementById("edit-user-story");
                      if (form) {
                        form.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
