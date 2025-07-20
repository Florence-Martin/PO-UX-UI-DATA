import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DoDProgress } from "@/lib/types/userStory";
import { AlertCircle, CheckCircle2, Circle } from "lucide-react";

interface UserStoryDoDProps {
  dodProgress?: DoDProgress;
  onUpdate?: (newProgress: DoDProgress) => void;
  readOnly?: boolean;
  showPercentage?: boolean;
}

const DOD_CRITERIA = [
  {
    key: "codeReviewed" as keyof DoDProgress,
    label: "Code relu par un pair",
    description: "Le code a été revu et validé par un pair",
  },
  {
    key: "testsWritten" as keyof DoDProgress,
    label: "Tests unitaires écrits",
    description: "Tests automatisés écrits et fonctionnels",
  },
  {
    key: "testedLocally" as keyof DoDProgress,
    label: "Fonction testée en local",
    description: "Tests manuels effectués en environnement local",
  },
  {
    key: "testedStaging" as keyof DoDProgress,
    label: "Fonction validée en staging",
    description: "Tests effectués en environnement de staging",
  },
  {
    key: "documentationUpdated" as keyof DoDProgress,
    label: "Documentation mise à jour",
    description: "Documentation technique et utilisateur mise à jour",
  },
  {
    key: "ticketDone" as keyof DoDProgress,
    label: "Ticket passé en Done",
    description: "Ticket marqué comme terminé dans Jira/Kanban",
  },
];

export function UserStoryDoD({
  dodProgress = {
    codeReviewed: false,
    testsWritten: false,
    testedLocally: false,
    testedStaging: false,
    documentationUpdated: false,
    ticketDone: false,
  },
  onUpdate,
  readOnly = false,
  showPercentage = true,
}: UserStoryDoDProps) {
  const completedCount = Object.values(dodProgress).filter(Boolean).length;
  const totalCount = DOD_CRITERIA.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const handleCriteriaChange = (key: keyof DoDProgress, checked: boolean) => {
    if (readOnly || !onUpdate) return;

    const newProgress = {
      ...dodProgress,
      [key]: checked,
    };
    onUpdate(newProgress);
  };

  const getStatusIcon = () => {
    if (percentage === 100)
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (percentage > 0)
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">Definition of Done</span>
          </div>
          {showPercentage && (
            <Badge
              variant={percentage === 100 ? "default" : "secondary"}
              className="text-xs"
            >
              {completedCount}/{totalCount} ({percentage}%)
            </Badge>
          )}
        </div>
        {showPercentage && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
      <div className="space-y-3">
        {DOD_CRITERIA.map((criteria) => (
          <div key={criteria.key} className="flex items-start space-x-3">
            <Checkbox
              id={criteria.key}
              checked={dodProgress[criteria.key]}
              onCheckedChange={(checked) =>
                handleCriteriaChange(criteria.key, checked as boolean)
              }
              disabled={readOnly}
              className="mt-0.5 flex-shrink-0"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <label
                htmlFor={criteria.key}
                className={`text-sm font-medium leading-none block cursor-pointer ${
                  dodProgress[criteria.key]
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {criteria.label}
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {criteria.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserStoryDoDSummary({
  dodProgress,
}: {
  dodProgress?: DoDProgress;
}) {
  if (!dodProgress) return null;

  const completedCount = Object.values(dodProgress).filter(Boolean).length;
  const totalCount = DOD_CRITERIA.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const getStatusColor = () => {
    if (percentage === 100) return "bg-green-500 text-white";
    if (percentage >= 70) return "bg-yellow-500 text-black";
    if (percentage >= 40) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <Badge
      className={`${getStatusColor()} text-xs sm:text-sm whitespace-nowrap`}
    >
      <span className="hidden sm:inline">DoD: </span>
      {completedCount}/{totalCount} ({percentage}%)
    </Badge>
  );
}
