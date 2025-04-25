import { useState, useEffect, useRef } from "react";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { createSprint, updateSprint } from "@/lib/services/sprintService";
import { updateUserStorySprint } from "@/lib/services/userStoryService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export function useSprintDetail(
  sprint: Sprint | null,
  userStories: UserStory[],
  onClose: () => void,
  refetch: () => void
) {
  const isCreating = sprint === null;

  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [showStoryList, setShowStoryList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [edited, setEdited] = useState<{ userStoryIds: string[] }>({
    userStoryIds: [],
  });

  useEffect(() => {
    if (sprint) {
      setEdited({
        userStoryIds: userStories
          .filter((us) => us.sprintId === sprint.id)
          .map((us) => us.id),
      });
    }
  }, [sprint, userStories]);

  const toggleUserStorySelection = (storyId: string) => {
    setEdited((prev) => ({
      userStoryIds: prev.userStoryIds.includes(storyId)
        ? prev.userStoryIds.filter((id) => id !== storyId)
        : [...prev.userStoryIds, storyId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value.trim() || "";
    const startDateStr = startDateRef.current?.value;
    const endDateStr = endDateRef.current?.value;

    if (!title || !startDateStr || !endDateStr) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate > endDate) {
      toast.error("La date de début doit être antérieure à la date de fin.");
      return;
    }

    try {
      if (isCreating) {
        const newSprintId = await createSprint({
          title,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          userStoryIds: edited.userStoryIds,
          velocity: 0,
        });

        for (const storyId of edited.userStoryIds) {
          await updateUserStorySprint(storyId, newSprintId);
        }

        toast.success("Sprint créé avec succès !");
      } else {
        await updateSprint(sprint.id, {
          title,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          userStoryIds: edited.userStoryIds,
        });

        for (const story of userStories) {
          const shouldBeLinked = edited.userStoryIds.includes(story.id);
          const alreadyLinked = story.sprintId === sprint.id;

          if (shouldBeLinked && !alreadyLinked) {
            await updateUserStorySprint(story.id, sprint.id);
          } else if (!shouldBeLinked && alreadyLinked) {
            await updateUserStorySprint(story.id, null);
          }
        }

        toast.success("Sprint modifié avec succès !");
      }

      await refetch();
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du sprint", err);
      toast.error("Erreur lors de l'enregistrement du sprint.");
    }
  };

  const usedUserStoryIds = userStories
    .filter((us) => us.sprintId && us.sprintId !== sprint?.id)
    .map((us) => us.id);

  const filteredStories = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    isCreating,
    titleRef,
    startDateRef,
    endDateRef,
    showStoryList,
    setShowStoryList,
    searchTerm,
    setSearchTerm,
    edited,
    toggleUserStorySelection,
    handleSubmit,
    usedUserStoryIds,
    filteredStories,
  };
}
