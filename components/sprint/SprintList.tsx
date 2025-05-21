"use client";

import { SprintDetailModal } from "./SprintDetailModal";
import { SprintPlanningCard } from "./SprintPlanningCard";
import { Button } from "../ui/button";
import { useSprintList, useSprints } from "@/hooks/sprint";

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
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <div className="space-y-6">
      <Button onClick={openModal} className="ml-auto mb-4">
        + Créer un sprint
      </Button>

      {sortedSprints.map((sprint) => (
        <div key={sprint.id} id={sprint.id}>
          <SprintPlanningCard
            key={sprint.id}
            sprint={sprint}
            userStories={userStories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
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
