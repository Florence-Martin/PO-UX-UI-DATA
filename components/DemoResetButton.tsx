"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DemoStore } from "@/lib/demo/demoStore";
import { isDemoMode } from "@/lib/utils/demoMode";
import { Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export function DemoResetButton() {
  const [isDemo, setIsDemo] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setIsDemo(isDemoMode());
  }, []);

  if (!isDemo) return null;

  const handleReset = () => {
    setIsResetting(true);

    // Effacer le snapshot local
    DemoStore.clearSnapshot();

    // Recharger la page pour déclencher un nouveau import Firestore
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-full"
          disabled={isResetting}
        >
          {isResetting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Reset Démo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Réinitialiser le snapshot démo ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Cette action va :</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Supprimer toutes vos modifications locales</li>
              <li>Re-télécharger les données depuis Firestore</li>
              <li>Créer un nouveau snapshot de démonstration</li>
            </ul>
            <p className="text-foreground font-medium mt-3">
              ⚠️ Vos modifications ne seront pas sauvegardées.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResetting}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={isResetting}>
            {isResetting ? "Réinitialisation..." : "Réinitialiser"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
