"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FilePenLine, X } from "lucide-react";
import { BacklogTask } from "@/lib/types/backlogTask";
import { UserStory } from "@/lib/types/userStory";
import { getAllUserStories } from "@/lib/services/userStoryService";

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
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [showStoryList, setShowStoryList] = useState(false);

  useEffect(() => {
    if (task) {
      setEdited(task);
    }
  }, [task]);

  useEffect(() => {
    getAllUserStories().then(setUserStories);
  }, []);

  if (!isOpen || !edited) return null;

  const toggleUserStorySelection = (storyId: string) => {
    const currentIds = edited.userStoryIds || [];
    const updatedIds = currentIds.includes(storyId)
      ? currentIds.filter((id) => id !== storyId)
      : [...currentIds, storyId];
    setEdited({ ...edited, userStoryIds: updatedIds });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      {/* <div className="relative bg-white dark:bg-neutral-900 text-black border-4 border-gray-200 border-t-gray-500 dark:text-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"> */}
      <div className="relative w-full mx-4 max-w-md sm:max-w-xl lg:max-w-2xl bg-white dark:bg-neutral-900 text-black dark:text-white border-4 border-gray-200 border-t-gray-500 rounded-xl shadow-lg p-6 space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut
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
            <option value="in-testing">À tester</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Lier aux user stories
          </label>

          {(edited.userStoryIds?.length ?? 0) > 0 && (
            <ul className="text-sm text-muted-foreground mb-2 list-disc list-inside space-y-1">
              {userStories
                .filter((story) =>
                  edited.userStoryIds?.includes(story.id || "")
                )
                .map((story) => (
                  <li key={story.id}>{story.title}</li>
                ))}
            </ul>
          )}

          <button
            onClick={() => setShowStoryList(!showStoryList)}
            className="text-xs underline text-primary flex items-center gap-1 mb-2"
          >
            {showStoryList ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {showStoryList ? "Masquer" : "Afficher la liste"}
          </button>

          {showStoryList && (
            <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
              {userStories.map((story) => (
                <label
                  key={story.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={edited.userStoryIds?.includes(story.id || "")}
                    onChange={() => toggleUserStorySelection(story.id || "")}
                  />
                  <span>{story.title}</span>
                </label>
              ))}
            </div>
          )}
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
