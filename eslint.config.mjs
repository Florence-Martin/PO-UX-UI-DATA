import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    // Dette existante révélée par Next 16.4 : conserver les diagnostics
    // de synchronisation d'état en avertissements sur ces fichiers seulement.
    // La règle reste bloquante dans les nouveaux composants et hooks.
    files: [
      "components/Sidebar.tsx",
      "components/bi/EditDeliverableModal.tsx",
      "components/bi/EditKpiModal.tsx",
      "components/searchbar/FilterUserStoryList.tsx",
      "components/searchbar/MoscowFilterSelect.tsx",
      "components/searchbar/PriorityFilterSelect.tsx",
      "components/ui/carousel.tsx",
      "context/TimelineContext.tsx",
      "hooks/useBacklogTasks.ts",
      "hooks/useDashboardKPIs.ts",
      "hooks/useMediaQuery.ts",
      "hooks/usePersonas.ts",
      "hooks/useRoadmap.ts",
      "hooks/useTimeSeriesMetrics.ts",
      "hooks/useTimeline.ts",
      "hooks/useUserMetrics.ts",
      "hooks/useUserStories.ts",
      "hooks/useWireframeGrid.ts",
    ],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
