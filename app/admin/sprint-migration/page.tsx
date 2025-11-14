"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cleanupCompletedSprintsBadges,
  debugUserStory,
  migrateExpiredSprints,
} from "@/lib/services/sprintService";
import { CheckCircle2, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SprintMigrationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isCleaningBadges, setIsCleaningBadges] = useState(false);
  const [lastResult, setLastResult] = useState<Array<{
    sprintTitle: string;
    moved: number;
    completed: number;
    tasksMoved: number;
    tasksCompleted: number;
  }> | null>(null);
  const [lastCleanupResult, setLastCleanupResult] = useState<{
    cleaned: number;
    userStoriesCleaned: number;
    tasksCleaned: number;
  } | null>(null);

  const handleMigration = async () => {
    try {
      setIsRunning(true);
      const results = await migrateExpiredSprints(true, true);
      setLastResult(results);

      if (results.length > 0) {
        const totalMoved = results.reduce((acc, r) => acc + r.moved, 0);
        const totalCompleted = results.reduce((acc, r) => acc + r.completed, 0);
        const totalTasksMoved = results.reduce(
          (acc, r) => acc + r.tasksMoved,
          0
        );
        const totalTasksCompleted = results.reduce(
          (acc, r) => acc + r.tasksCompleted,
          0
        );

        toast.success(
          `${results.length} sprint(s) clôturé(s) - ${totalCompleted} US terminées, ${totalMoved} US reportées + ${totalTasksCompleted} tâches terminées, ${totalTasksMoved} tâches reportées`
        );
      } else {
        toast.info("Aucun sprint à clôturer automatiquement");
      }
    } catch (error) {
      console.error("Erreur lors de la migration:", error);
      toast.error("Erreur lors de la migration des sprints");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCleanupBadges = async () => {
    try {
      setIsCleaningBadges(true);
      const result = await cleanupCompletedSprintsBadges();
      setLastCleanupResult(result);

      if (result.cleaned > 0) {
        toast.success(
          `${result.cleaned} badge(s) nettoyé(s) (${result.userStoriesCleaned} User Stories + ${result.tasksCleaned} tâches)`
        );
      } else {
        toast.info("Aucun badge à nettoyer");
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
      toast.error("Erreur lors du nettoyage des badges");
    } finally {
      setIsCleaningBadges(false);
    }
  };

  const handleDebugUS009 = async () => {
    try {
      await debugUserStory("US-009");
      toast.info("Vérifiez la console pour les détails de l'US-009");
    } catch (error) {
      console.error("Erreur debug:", error);
      toast.error("Erreur lors du debug");
    }
  };

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Migration des Sprints
        </h1>
        <p className="text-muted-foreground">
          Clôture automatique des sprints dont la date de fin est dépassée
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clôture automatique des sprints expirés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette fonction identifie tous les sprints dont la date de fin est
            dépassée et les clôture automatiquement en mettant à jour :
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Statut → &quot;done&quot;</li>
            <li>Progress → 100%</li>
            <li>hasReview → true</li>
            <li>hasRetrospective → true</li>
            <li>closedAt → date actuelle</li>
            <li>User Stories incomplètes → reportées au backlog</li>
            <li>Tasks incomplètes → reportées au backlog</li>
          </ul>

          <div className="flex gap-4">
            <Button
              onClick={handleMigration}
              disabled={isRunning}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Migration en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Migrer les sprints expirés
                </>
              )}
            </Button>

            <Button
              onClick={handleCleanupBadges}
              disabled={isCleaningBadges}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              {isCleaningBadges ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Nettoyage...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Nettoyer les badges
                </>
              )}
            </Button>

            <Button
              onClick={handleDebugUS009}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              🔍 Debug US-009
            </Button>
          </div>

          {lastCleanupResult !== null && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Dernier nettoyage :</strong> {lastCleanupResult.cleaned}{" "}
                badge(s) nettoyé(s)
              </p>
              {lastCleanupResult.cleaned > 0 && (
                <p className="text-xs text-red-700 mt-1">
                  • {lastCleanupResult.userStoriesCleaned} User Stories •{" "}
                  {lastCleanupResult.tasksCleaned} tâches
                </p>
              )}
            </div>
          )}

          {lastResult !== null && lastResult.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium mb-2">
                <strong>Dernière migration :</strong> {lastResult.length}{" "}
                sprint(s) traité(s)
              </p>
              <div className="space-y-1">
                {lastResult.map((result, index) => (
                  <div key={index} className="text-xs text-green-700">
                    <p>
                      📊 <strong>{result.sprintTitle}</strong>:
                    </p>
                    <p className="ml-4">
                      • {result.completed} US terminées, {result.moved} US
                      reportées au backlog
                    </p>
                    <p className="ml-4">
                      • {result.tasksCompleted} tâches terminées,{" "}
                      {result.tasksMoved} tâches reportées au backlog
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastResult !== null && lastResult.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Dernière migration :</strong> Aucun sprint à traiter
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nettoyage des badges des sprints terminés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette fonction nettoie les badges &quot;sprint&quot; des User
            Stories et tâches qui appartiennent à des sprints terminés. Ces
            éléments ne doivent plus apparaître dans le Sprint Backlog actif.
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Identifie tous les sprints avec status = &quot;done&quot;</li>
            <li>Trouve toutes les User Stories liées à ces sprints</li>
            <li>Trouve toutes les tâches liées à ces sprints</li>
            <li>Retire le badge &quot;sprint&quot; de ces éléments</li>
            <li>
              Les éléments restent visibles dans la vue historique du sprint
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
