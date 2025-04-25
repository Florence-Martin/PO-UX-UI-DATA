// juste pour les données

import { useEffect, useState } from "react";
import { getAllSprints } from "@/lib/services/sprintService";
import { Sprint } from "@/lib/types/sprint";

/**
 * Hook personnalisé pour récupérer et gérer les sprints.
 * @returns {Object} - Un objet contenant les sprints et une fonction de rafraîchissement.
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
