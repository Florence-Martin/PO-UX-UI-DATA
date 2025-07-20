import { Sprint } from "@/lib/types/sprint";
import { UserStory } from "@/lib/types/userStory";

export interface SprintDiagnostic {
  id: string;
  status: "active" | "completed" | "expired";
  issues: string[];
  recommendations: string[];
  userStoriesCount: number;
  completedUserStoriesCount: number;
  dodCompletionRate: number;
}

export function analyzeSprintHealth(
  sprint: Sprint,
  userStories: UserStory[]
): SprintDiagnostic {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const sprintUserStories = userStories.filter(
    (us) => us.sprintId === sprint.id
  );
  const completedUserStories = sprintUserStories.filter(
    (us) => us.status === "done"
  );

  // Calculer le taux de completion DoD
  const totalDodItems = sprintUserStories.length * 6; // 6 critères DoD par user story

  const completedDodItems = sprintUserStories.reduce((total, us) => {
    if (!us.dodProgress) return total;
    return total + Object.values(us.dodProgress).filter(Boolean).length;
  }, 0);

  const dodCompletionRate =
    totalDodItems > 0 ? (completedDodItems / totalDodItems) * 100 : 0;

  // Analyser les problèmes
  if (
    sprint.endDate &&
    sprint.endDate.toDate() < new Date() &&
    sprint.status !== "done"
  ) {
    issues.push("Sprint expiré mais pas encore clos");
    recommendations.push(
      "Clôturer le sprint et migrer les éléments incomplets"
    );
  }

  if (sprintUserStories.length === 0) {
    issues.push("Aucune user story assignée au sprint");
    recommendations.push("Ajouter des user stories au sprint");
  }

  if (dodCompletionRate < 50) {
    issues.push("Taux de completion DoD faible");
    recommendations.push("Revoir les critères de Definition of Done");
  }

  if (completedUserStories.length === 0 && sprintUserStories.length > 0) {
    issues.push("Aucune user story complétée");
    recommendations.push("Vérifier l'avancement du sprint");
  }

  return {
    id: sprint.id,
    status: sprint.status as "active" | "completed" | "expired",
    issues,
    recommendations,
    userStoriesCount: sprintUserStories.length,
    completedUserStoriesCount: completedUserStories.length,
    dodCompletionRate,
  };
}

export function generateSprintReport(diagnostics: SprintDiagnostic[]): string {
  const totalSprints = diagnostics.length;
  const activeSprints = diagnostics.filter((d) => d.status === "active").length;
  const completedSprints = diagnostics.filter(
    (d) => d.status === "completed"
  ).length;
  const expiredSprints = diagnostics.filter(
    (d) => d.status === "expired"
  ).length;

  let report = `## Rapport d'analyse des sprints\n\n`;
  report += `- Total des sprints: ${totalSprints}\n`;
  report += `- Sprints actifs: ${activeSprints}\n`;
  report += `- Sprints complétés: ${completedSprints}\n`;
  report += `- Sprints expirés: ${expiredSprints}\n\n`;

  diagnostics.forEach((diagnostic) => {
    report += `### Sprint ${diagnostic.id}\n`;
    report += `- Status: ${diagnostic.status}\n`;
    report += `- User stories: ${diagnostic.completedUserStoriesCount}/${diagnostic.userStoriesCount}\n`;
    report += `- DoD completion: ${diagnostic.dodCompletionRate.toFixed(1)}%\n`;

    if (diagnostic.issues.length > 0) {
      report += `- Problèmes:\n`;
      diagnostic.issues.forEach((issue) => {
        report += `  - ${issue}\n`;
      });
    }

    if (diagnostic.recommendations.length > 0) {
      report += `- Recommandations:\n`;
      diagnostic.recommendations.forEach((rec) => {
        report += `  - ${rec}\n`;
      });
    }

    report += `\n`;
  });

  return report;
}
