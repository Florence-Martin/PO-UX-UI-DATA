import { useEffect, useState } from "react";
import {
  createUserStory,
  deleteUserStory,
  getAllUserStories,
  updateUserStory,
  UserStory,
} from "@/lib/services/userStoryService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export function useDocumentation() {
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

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("");
    setStoryPoints(null);
    setAcceptanceCriteria("");
  };

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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      toast.success("User story sauvegardée ✅");
    }

    resetForm();
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

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    storyPoints,
    setStoryPoints,
    acceptanceCriteria,
    setAcceptanceCriteria,
    userStories,
    isEditing,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
  };
}
