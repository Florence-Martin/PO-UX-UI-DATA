"use client";

import { SprintHistoryTabs } from "./SprintHistoryTabs";
import { useSprints } from "@/hooks/useSprints";

export default function SprintHistoryWrapper() {
  const { sprints } = useSprints();

  return <SprintHistoryTabs sprints={sprints} />;
}
