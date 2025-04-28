"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { ArrowDownToDot, Info, List, Notebook, Pen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useUserStories } from "@/hooks/useUserStories";
import { UserStorySearchBar } from "../searchbar/UserStorySearchBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserStories() {
  const {
    title,
    description,
    priority,
    storyPoints,
    acceptanceCriteria,
    isEditing,
    editingCode,
    moscow,
    setTitle,
    setDescription,
    setPriority,
    setStoryPoints,
    setAcceptanceCriteria,
    setMoscow,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    filteredStories,
    filterByPriority,
    setUserStorySearchTerm,
  } = useUserStories();

  const searchParams = useSearchParams();
  const router = useRouter();
  const storyIdToEdit = searchParams.get("edit");
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-sélection d’une user story depuis l’URL
  useEffect(() => {
    if (!storyIdToEdit || filteredStories.length === 0) return;

    const matched = filteredStories.find((s) => s.id === storyIdToEdit);
    if (matched) {
      handleEdit(matched);
      router.replace("/analysis?tab=documentation", { scroll: false });

      setTimeout(() => {
        const el = document.getElementById("edit-user-story");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [storyIdToEdit, filteredStories]);

  // Surlignage temporaire
  useEffect(() => {
    if (isEditing && cardRef.current) {
      const el = cardRef.current;
      el.classList.add("ring-2", "ring-primary", "transition-shadow");
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 3000);
    }
  }, [isEditing]);

  return (
    <div className="grid gap-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Formulaire */}
        <Card id="edit-user-story" ref={cardRef}>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center">
                <Notebook className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-base sm:text-lg">
                  Éditeur de User Stories
                </span>
                {isEditing && editingCode && (
                  <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 shadow-sm animate-pulse">
                    <Pen className="w-3 h-3" />
                    <span>En modification</span>
                    <span className="font-mono text-[14px] text-primary/70">
                      {editingCode}
                    </span>
                  </span>
                )}
              </div>

              <TooltipProvider>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/not-found"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center"
                      >
                        <Image
                          src="/jira.svg"
                          alt="Jira Logo"
                          width={10}
                          height={10}
                          className="mr-1 h-4 w-4"
                        />
                        Jira
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Ouvrir le board Jira du projet
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/not-found"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center"
                      >
                        <Image
                          src="/confluence.svg"
                          alt="Confluence Logo"
                          width={10}
                          height={10}
                          className="mr-1 h-4 w-4"
                        />
                        Confluence
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Accéder à la documentation Confluence
                    </TooltipContent>
                  </Tooltip>

                  <Link
                    href="#user-stories-list"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    <ArrowDownToDot className="w-5 h-5 mr-1" />
                    Liste user stories
                  </Link>
                </div>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Titre */}
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="En tant que [rôle], je veux [action] afin de [bénéfice]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée de la user story..."
              />
            </div>

            {/* Priorité & Story points */}
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

            {/* Critères d'acceptation */}
            <div className="space-y-2">
              <Label>Critères d’Acceptation</Label>
              <Textarea
                id="acceptance-criteria"
                value={acceptanceCriteria}
                onChange={(e) => setAcceptanceCriteria(e.target.value)}
                placeholder="Critères pour valider la user story"
              />
            </div>

            {/* Boutons */}
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

        {/* Liste des User Stories */}
        <Card id="user-stories-list" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              <span>Liste de User Stories</span>
            </CardTitle>
            <UserStorySearchBar
              onFilterChange={filterByPriority}
              onSearchChange={setUserStorySearchTerm}
            />
          </CardHeader>

          <CardContent className="space-y-3">
            {filteredStories.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Désolé, aucun résultat !
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
                  <div className="mb-3 flex justify-between">
                    {story.code && (
                      <span className="text-lg font-mono tracking-wide">
                        {story.code}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        story.priority === "high"
                          ? "bg-red-500/10 text-red-500"
                          : story.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {story.priority}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {story.title}
                  </h3>
                  <p className="text-sm italic">{story.description}</p>
                  <div className="text-sm text-yellow-500 flex items-center gap-1 mt-2">
                    ⭐{" "}
                    <span className="text-foreground">
                      {story.storyPoints} points
                    </span>
                  </div>
                  <p className="text-sm mt-2 whitespace-pre-line">
                    {story.acceptanceCriteria}
                  </p>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        handleEdit(story);
                        toast.success("✅ Modification");
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
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
    </div>
  );
}
