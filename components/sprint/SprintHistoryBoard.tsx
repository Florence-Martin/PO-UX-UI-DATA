"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSprintTasks } from "@/lib/services/sprintService";
import { BacklogTask } from "@/lib/types/backlogTask";
import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";
import {
  CheckCircle2,
  CircleDashed,
  Clock,
  FlaskConical,
  Info,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const columns = [
  {
    label: "À faire",
    status: "todo" as const,
    icon: <CircleDashed className="w-4 h-4" />,
    description: "Tâches qui étaient prêtes à démarrer",
  },
  {
    label: "En cours",
    status: "in-progress" as const,
    icon: <LoaderCircle className="w-4 h-4" />,
    description: "Tâches qui étaient en développement",
  },
  {
    label: "À tester",
    status: "in-testing" as const,
    icon: <FlaskConical className="w-4 h-4" />,
    description: "Tâches qui étaient en phase de test",
  },
  {
    label: "Terminé",
    status: "done" as const,
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: "Tâches terminées et validées",
  },
];

interface Props {
  sprint: Sprint;
  userStories: UserStory[];
}

export function SprintHistoryBoard({ sprint, userStories }: Props) {
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprintTasks = async () => {
      try {
        setLoading(true);
        const sprintTasks = await getSprintTasks(sprint.id, userStories);
        setTasks(sprintTasks);
      } catch (error) {
        console.error("Erreur lors du chargement des tâches du sprint:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSprintTasks();
  }, [sprint.id, userStories]);

  const totalPoints = tasks.reduce(
    (sum, task) => sum + (task.storyPoints || 0),
    0
  );

  const donePoints = tasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + (task.storyPoints || 0), 0);

  const percentDone =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="w-6 h-6 animate-spin mr-2" />
        Chargement des tâches du sprint...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques */}
      <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-gray-400">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg">
            Sprint Historique - {sprint.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            📅{" "}
            {(sprint.startDate instanceof Date
              ? sprint.startDate
              : sprint.startDate.toDate()
            ).toLocaleDateString()}{" "}
            -{" "}
            {(sprint.endDate instanceof Date
              ? sprint.endDate
              : sprint.endDate.toDate()
            ).toLocaleDateString()}
          </span>
          <span>📊 {tasks.length} tâches</span>
          <span>⭐ {totalPoints} points</span>
          <span>✅ {percentDone}% terminé</span>
        </div>
      </div>

      {/* Colonnes de tâches */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const tasksForColumn = tasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.label}
              className="bg-muted/30 p-4 rounded-xl shadow-sm w-full flex flex-col justify-between opacity-75"
            >
              <div className="flex items-center gap-2 mb-2">
                {col.icon}
                <h3 className="text-lg font-semibold truncate">{col.label}</h3>
                <span className="text-sm text-muted-foreground">
                  {tasksForColumn.length}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{col.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-2 overflow-hidden">
                {tasksForColumn.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune tâche</p>
                ) : (
                  tasksForColumn.map((task) => {
                    const userStory = userStories.find((us) =>
                      task.userStoryIds?.includes(us.id!)
                    );

                    return (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-background/60 border space-y-2 min-h-[120px] opacity-90"
                      >
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-mono truncate">
                            {userStory?.code ?? "US-???"}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Historique
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">
                            {task.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="bg-muted px-2 py-1 rounded-full">
                            {task.storyPoints} pts
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
