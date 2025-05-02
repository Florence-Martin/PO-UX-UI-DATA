import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";
import { Timestamp } from "firebase/firestore";

/**
 * Vérifie si le sprint est actif (en cours).
 */
function isCurrentSprint(sprint: Sprint): boolean {
  const now = new Date();

  const start =
    sprint.startDate instanceof Timestamp
      ? sprint.startDate.toDate()
      : new Date(sprint.startDate);

  const end =
    sprint.endDate instanceof Timestamp
      ? sprint.endDate.toDate()
      : new Date(sprint.endDate);

  return now >= start && now <= end;
}

/**
 * Hook pour charger les sprints et identifier celui en cours.
 */
export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  const refetch = async () => {
    const data = await getAllSprints();
    setSprints(data);

    const active = data.find(isCurrentSprint) || null;
    setCurrentSprint(active);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { sprints, currentSprint, refetch };
}
