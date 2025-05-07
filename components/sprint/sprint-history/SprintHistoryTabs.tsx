import React, { useState } from "react";
import { LayoutGrid, LineChart } from "lucide-react";
import { SprintHistoryTimeline } from "./SprintHistoryTimeline";
import { Sprint } from "@/lib/types/sprint";

interface SprintHistoryTabsProps {
  sprints: Sprint[];
}

export function SprintHistoryTabs({ sprints }: SprintHistoryTabsProps) {
  const [activeTab, setActiveTab] = useState<"cards" | "timeline">("cards");

  return (
    <div className="w-full p-4 sm:p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row border-b mb-4">
        <button
          className={`flex items-center justify-center sm:justify-start px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === "cards"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("cards")}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Cartes
        </button>
        <button
          className={`flex items-center justify-center sm:justify-start px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === "timeline"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("timeline")}
        >
          <LineChart className="h-4 w-4 mr-2" />
          Timeline
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "cards" ? (
          <SprintHistoryTimeline sprints={sprints} />
        ) : (
          <p className="text-center sm:text-left">Timeline à implémenter</p>
        )}
      </div>
    </div>
  );
}
