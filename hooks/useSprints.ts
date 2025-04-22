// hooks/useSprints.ts

import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";

/**
 * Custom hook to fetch and manage sprints.
 * @returns {Object} - An object containing the sprints and a refetch function.
 */
export function useSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const refetch = async () => {
    const data = await getAllSprints();
    setSprints(data);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { sprints, refetch };
}
