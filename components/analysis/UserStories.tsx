"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowDownToDot, List, Notebook, Pen, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UserStoryQualityPanel } from "@/components/analysis/UserStoryQualityPanel";
import { ExpandableSection } from "@/components/backlog/ExpandableSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStories } from "@/hooks/useUserStories";
import { useUserStoryQuality } from "@/hooks/useUserStoryQuality";
import { Loader2 } from "lucide-react";
import { UserStorySearchBar } from "../searchbar/UserStorySearchBar";

export function UserStories() {
  const {
    title,
    description,
    priority,
    storyPoints,
    acceptanceCriteria,
    isEditing,
    editingCode,
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
    setUserStorySearchTerm,
  } = useUserStories();

  const {
    analysis,
    isLoading: isAnalyzing,
    error: analysisError,
    analyzeUserStory,
    reset: resetAnalysis,
  } = useUserStoryQuality();

  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

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
  }, [storyIdToEdit, filteredStories, handleEdit, router]);

  // Reset de l'analyse quand on change de US ou qu'on annule
  useEffect(() => {
    if (!isEditing) {
      resetAnalysis();
      setAccordionValue(undefined);
    }
  }, [isEditing, resetAnalysis]);

  // Surlignage temporaire
  useEffect(() => {
    if (isEditing && cardRef.current) {
      const el = cardRef.current;
      el.classList.add("ring-2", "ring-primary", "transition-shadow");
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 3000);
    }
  }, [isEditing]);

  // Fonction pour analyser la qualité
  const handleAnalyze = async () => {
    if (!title.trim() || !acceptanceCriteria.trim()) return;

    await analyzeUserStory({
      title: title.trim(),
      description: description.trim(),
      acceptanceCriteria: acceptanceCriteria.trim(),
      code: editingCode || undefined,
      priority: priority || undefined,
    });

    // Ouvrir l'accordéon automatiquement après l'analyse
    setAccordionValue("quality-analysis");
  };

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

            {/* Section Quality Checker */}
            <div className="border rounded-lg bg-muted/30">
              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={(val) => {
                  console.log("Accordion changed:", val);
                  setAccordionValue(val);
                }}
              >
                <AccordionItem value="quality-analysis" className="border-none">
                  <AccordionTrigger className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold">
                        Analyse de Qualité IA
                      </span>
                      {analysis && (
                        <span className="ml-2 text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                          Analysé
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                    {!analysis && !isAnalyzing && !analysisError && (
                      <div className="text-center py-6 bg-card rounded-lg border border-border">
                        <p className="text-sm text-foreground mb-4 px-4">
                          Obtenez une analyse détaillée de la qualité de cette
                          User Story (clarté, testabilité, risques)
                        </p>

                        <Button
                          onClick={handleAnalyze}
                          disabled={!title.trim() || !acceptanceCriteria.trim()}
                          variant="default"
                          className="gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Analyser la qualité
                        </Button>

                        {(!title.trim() || !acceptanceCriteria.trim()) && (
                          <p className="text-xs text-muted-foreground mt-3 px-4">
                            ⚠️ Le titre et les critères d&apos;acceptation sont
                            requis
                          </p>
                        )}
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                        <p className="text-sm text-muted-foreground">
                          Analyse en cours...
                        </p>
                      </div>
                    )}

                    {analysisError && (
                      <Alert variant="destructive">
                        <AlertDescription>{analysisError}</AlertDescription>
                      </Alert>
                    )}

                    {analysis && !isAnalyzing && (
                      <div className="space-y-4">
                        <UserStoryQualityPanel analysis={analysis} />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleAnalyze}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Sparkles className="h-4 w-4" />
                            Ré-analyser
                          </Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

                  <div className="mt-2">
                    <ExpandableSection
                      label="Critères d'acceptation"
                      content={story.acceptanceCriteria || ""}
                      isLong={true}
                      clampClass="line-clamp-3"
                      fullClass="text-sm whitespace-pre-line"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        router.push(
                          `/analysis?tab=documentation&edit=${story.id}`,
                          { scroll: false }
                        );
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
