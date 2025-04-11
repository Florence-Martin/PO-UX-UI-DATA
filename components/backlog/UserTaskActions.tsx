"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PencilLine, Trash2 } from "lucide-react";
import { BacklogTask } from "@/lib/types/backlogTask";
import { useBacklogTasks } from "@/hooks/useBacklogTasks";

export function UserTaskActions({ task }: { task: BacklogTask }) {
  const { handleEdit, handleDelete } = useBacklogTasks();

  const handleEditClick = () => {
    handleEdit(task);
    toast.success("✅ Modification !");
    const form = document.getElementById("edit-user-task");
    if (form) {
      setTimeout(() => {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  };

  const handleDeleteClick = () => {
    if (!task.id) return;
    handleDelete(task.id);
  };

  return (
    <div className="flex flex-wrap justify-end gap-2 pt-2">
      <Button variant="secondary" size="sm" onClick={handleEditClick}>
        <PencilLine className="w-4 h-4 mr-1" />
        Modifier
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
        <Trash2 className="w-4 h-4 mr-1" />
        Supprimer
      </Button>
    </div>
  );
}
