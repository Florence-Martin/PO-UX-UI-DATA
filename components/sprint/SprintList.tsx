"use client";

import { useSprints } from "@/hooks/useSprints";
import { useSprintList } from "@/hooks/useSprintList";
import { SprintDetailModal } from "./SprintDetailModal";
import { SprintPlanningCard } from "./SprintPlanningCard";
import { Button } from "../ui/button";

export function SprintList() {
  const { sprints, refetch } = useSprints();
  const {
    userStories,
    selectedSprint,
    setSelectedSprint,
    isModalOpen,
    openModal,
    closeModal,
    handleEdit,
    handleDelete,
  } = useSprintList(refetch);

  const sortedSprints = [...sprints].sort((a, b) => {
    const aDate =
      a.startDate instanceof Date ? a.startDate : a.startDate.toDate();
    const bDate =
      b.startDate instanceof Date ? b.startDate : b.startDate.toDate();
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <div className="space-y-6">
      <Button onClick={openModal} className="ml-auto mb-4">
        + Créer un sprint
      </Button>

      {sortedSprints.map((sprint) => (
        <SprintPlanningCard
          key={sprint.id}
          sprint={sprint}
          userStories={userStories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {selectedSprint && (
        <SprintDetailModal
          sprint={selectedSprint}
          userStories={userStories}
          open={!!selectedSprint}
          onClose={() => {
            setSelectedSprint(null);
            refetch();
          }}
        />
      )}

      {isModalOpen && (
        <SprintDetailModal
          sprint={null}
          userStories={userStories}
          open={isModalOpen}
          onClose={() => {
            closeModal();
            refetch();
          }}
        />
      )}
    </div>
  );
}
