"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PencilLine, Trash2 } from "lucide-react";
import { UserStory } from "@/lib/types/userStory";
import { useUserStories } from "@/hooks/useUserStories";

export function UserStoryActions({ story }: { story: UserStory }) {
  const { handleEdit, handleDelete } = useUserStories();

  const handleEditClick = () => {
    handleEdit(story);
    toast.success("✅ Modification !");
    const form = document.getElementById("edit-user-story");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteClick = () => {
    handleDelete(story.id);
  };

  return (
    <div className="flex flex-wrap justify-end gap-2 pt-2">
      <Button variant="secondary" size="sm" onClick={handleEditClick}>
        <PencilLine className="w-4 h-4 mr-1" /> Modifier
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
      </Button>
    </div>
  );
}
