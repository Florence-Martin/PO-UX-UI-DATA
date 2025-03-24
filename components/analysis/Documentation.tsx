"use client";

import { useEffect, useState } from "react";
import {
  createUserStory,
  getAllUserStories,
  deleteUserStory,
  updateUserStory,
} from "@/lib/services/userStoryService";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface UserStory {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  storyPoints: number;
  acceptanceCriteria: string;
  createdAt: Date;
  updatedAt: Date;
}

const priorityStyles: Record<string, string> = {
  high: "text-red-600 border-red-600",
  medium: "text-yellow-500 border-yellow-500",
  low: "text-green-600 border-green-600",
};

export function Documentation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "">("");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      const stories = await getAllUserStories();
      setUserStories(stories);
    };
    fetchStories();
  }, []);

  const handleSave = async () => {
    if (!title || !priority || storyPoints === null) return;

    const payload = {
      title,
      description,
      priority,
      storyPoints,
      acceptanceCriteria,
    };

    if (isEditing && editingId) {
      await updateUserStory(editingId, payload);
      toast.success("User story mise à jour ✏️");
    } else {
      await createUserStory({
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("User story sauvegardée ✅");
    }

    // Reset
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("");
    setStoryPoints(null);
    setAcceptanceCriteria("");

    const updatedStories = await getAllUserStories();
    setUserStories(updatedStories);
  };

  const handleEdit = (story: UserStory) => {
    setIsEditing(true);
    setEditingId(story.id || null);
    setTitle(story.title);
    setDescription(story.description);
    setPriority(story.priority);
    setStoryPoints(story.storyPoints);
    setAcceptanceCriteria(story.acceptanceCriteria);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteUserStory(id);
    setUserStories((prev) => prev.filter((story) => story.id !== id));
    toast.success("User story supprimée ❌");
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>✍️ Éditeur de User Stories</CardTitle>
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
            <Label>Critères d&apos;Acceptation</Label>
            <Textarea
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="1. Étant donné [contexte], quand [action], alors [résultat attendu]"
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setDescription("");
                setPriority("");
                setStoryPoints(null);
                setAcceptanceCriteria("");
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Mettre à jour" : "Sauvegarder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📜 User Stories existantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userStories.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Aucune user story pour le moment. Commencez par en créer une !
            </p>
          ) : (
            userStories.map((story) => (
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

                <div className="text-sm text-yellow-500 flex items-center gap-1 ">
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
                    onClick={() => handleEdit(story)}
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
