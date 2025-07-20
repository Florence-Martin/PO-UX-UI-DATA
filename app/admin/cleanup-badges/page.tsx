"use client";

import { Button } from "@/components/ui/button";
import {
  cleanupCompletedSprintsBadges,
  syncSprintUserStories,
} from "@/lib/services/sprintService";
import { useState } from "react";
import { toast } from "sonner";

export default function CleanupBadgesPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<{ cleaned: number } | null>(null);
  const [syncResult, setSyncResult] = useState<{ synced: number } | null>(null);

  const handleCleanup = async () => {
    try {
      setIsRunning(true);
      console.log("🧹 Début du nettoyage...");

      const cleanupResult = await cleanupCompletedSprintsBadges();
      setResult(cleanupResult);

      if (cleanupResult.cleaned > 0) {
        toast.success(`${cleanupResult.cleaned} badge(s) "sprint" nettoyé(s)`);
      } else {
        toast.info("Aucun badge à nettoyer");
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
      toast.error("Erreur lors du nettoyage des badges");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      console.log("🔄 Début de la synchronisation...");

      const syncResult = await syncSprintUserStories();
      setSyncResult(syncResult);

      if (syncResult.synced > 0) {
        toast.success(`${syncResult.synced} sprint(s) synchronisé(s)`);
      } else {
        toast.info("Tous les sprints sont déjà synchronisés");
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast.error("Erreur lors de la synchronisation");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold">Outils d&apos;administration Sprint</h1>
        <p className="text-muted-foreground">
          Nettoyage et synchronisation des données Sprint
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="default"
            size="lg"
          >
            {isSyncing ? "Synchronisation en cours..." : "🔄 Synchroniser Sprint/User Stories"}
          </Button>

          <Button
            onClick={handleCleanup}
            disabled={isRunning}
            variant="destructive"
            size="lg"
          >
            {isRunning ? "Nettoyage en cours..." : "🧹 Nettoyer les badges"}
          </Button>
        </div>

        {syncResult !== null && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              🔄 Synchronisation terminée : {syncResult.synced} sprint(s) synchronisé(s)
            </p>
          </div>
        )}

        {result !== null && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              ✅ Nettoyage terminé : {result.cleaned} badge(s) nettoyé(s)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
