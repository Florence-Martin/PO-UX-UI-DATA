"use client";

import { useSprints } from "@/hooks/sprint";
import { SprintHistoryTabs } from "./SprintHistoryTabs";

export default function SprintHistoryWrapper() {
  const { sprints } = useSprints();

  return <SprintHistoryTabs sprints={sprints} />;
}
