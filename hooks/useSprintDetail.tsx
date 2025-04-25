import { useState, useEffect, useRef } from "react";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import { createSprint, updateSprint } from "@/lib/services/sprintService";
import { updateUserStorySprint } from "@/lib/services/userStoryService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { sprintSchema, sanitize } from "@/lib/utils/sprintSchema";

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

    const rawTitle = titleRef.current?.value || "";
    const sanitizedTitle = sanitize(rawTitle); //Assainissement du title via DOMPurify (sanitize(title))
    const startDateStr = startDateRef.current?.value;
    const endDateStr = endDateRef.current?.value;

    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    // Validation via Joi
    const validationResult = sprintSchema.validate({
      title: sanitizedTitle,
      startDate,
      endDate,
      userStoryIds: edited.userStoryIds,
    });

    if (validationResult.error) {
      toast.error(validationResult.error.message);
      return;
    }

    try {
      if (isCreating) {
        const newSprintId = await createSprint({
          title: sanitizedTitle,
          startDate: Timestamp.fromDate(startDate!),
          endDate: Timestamp.fromDate(endDate!),
          userStoryIds: edited.userStoryIds,
          velocity: 0,
        });

        for (const storyId of edited.userStoryIds) {
          await updateUserStorySprint(storyId, newSprintId);
        }

        toast.success("Sprint créé avec succès !");
      } else {
        await updateSprint(sprint.id, {
          title: sanitizedTitle,
          startDate: Timestamp.fromDate(startDate!),
          endDate: Timestamp.fromDate(endDate!),
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
