"use client";

import { useEffect, useState } from "react";
import { FilePenLine, X } from "lucide-react";
import { BacklogTask } from "@/lib/services/backlogTasksService";

interface EditTaskModalProps {
  task: BacklogTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: BacklogTask) => void;
  onDelete: (taskId: string) => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditTaskModalProps) {
  const [edited, setEdited] = useState<BacklogTask | null>(null);

  useEffect(() => {
    if (task) {
      setEdited(task);
    }
  }, [task]);

  if (!isOpen || !edited) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white dark:bg-neutral-900 text-black border-4 border-gray-200 border-t-gray-500 dark:text-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <FilePenLine />
          <span>Modifier la tâche</span>
        </h2>

        <input
          autoFocus
          value={edited.title}
          onChange={(e) => setEdited({ ...edited, title: e.target.value })}
          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white"
          placeholder="Titre"
        />

        <textarea
          value={edited.description}
          onChange={(e) =>
            setEdited({ ...edited, description: e.target.value })
          }
          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white"
          placeholder="Description"
        />

        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Priorité
          </label>
          <select
            value={edited.priority}
            onChange={(e) =>
              setEdited({ ...edited, priority: e.target.value as any })
            }
            className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Story points
          </label>
          <input
            type="number"
            value={edited.storyPoints}
            onChange={(e) =>
              setEdited({ ...edited, storyPoints: +e.target.value })
            }
            className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white"
            placeholder="Story points"
          />
        </div>

        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <select
            value={edited.status}
            onChange={(e) =>
              setEdited({ ...edited, status: e.target.value as any })
            }
            className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white"
          >
            <option value="todo">À faire</option>
            <option value="in-progress">En cours</option>
            <option value="in-testing">A tester</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <button
            className="text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
            onClick={() => onDelete(edited.id!)}
          >
            Supprimer
          </button>
          <button
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded hover:opacity-90"
            onClick={() => {
              onSave(edited);
              onClose();
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
