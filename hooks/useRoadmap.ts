import { useState, useEffect } from "react";
import {
  getRoadmapQuarters,
  saveRoadmapQuarter,
} from "@/lib/services/roadmapService";
import { RoadmapQuarter } from "@/lib/types/roadmapQuarter";

export function useRoadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapQuarter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await getRoadmapQuarters();
      data.sort((a, b) => {
        const [qa, ya] = a.id.toLowerCase().replace("q", "").split("-");
        const [qb, yb] = b.id.toLowerCase().replace("q", "").split("-");
        const yearDiff = Number(ya) - Number(yb);
        const quarterDiff = Number(qa) - Number(qb);
        return yearDiff !== 0 ? yearDiff : quarterDiff;
      });
      setRoadmap(data);
    } catch (error) {
      console.error("❌ Erreur lors du fetch de la roadmap :", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuarter = async (quarter: RoadmapQuarter) => {
    await saveRoadmapQuarter(quarter);
    await fetchRoadmap();
  };

  const updateQuarter = async (quarter: RoadmapQuarter) => {
    await saveRoadmapQuarter(quarter);
    await fetchRoadmap();
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return { roadmap, loading, addQuarter, updateQuarter };
}
