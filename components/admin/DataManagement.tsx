"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Download, RefreshCw, Trash2, Upload } from "lucide-react";
import { useState } from "react";

export function DataManagement() {
  const [isLoading, setIsLoading] = useState(false);

  const handleResetData = async () => {
    setIsLoading(true);
    try {
      // Ici vous pouvez ajouter la logique pour réinitialiser les données
      console.log("Réinitialisation des données...");
      // Simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    console.log("Export des données...");
  };

  const handleImportData = () => {
    console.log("Import des données...");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion des Données
          </CardTitle>
          <CardDescription>
            Outils pour gérer, sauvegarder et réinitialiser les données de
            l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <RefreshCw className="h-4 w-4" />
            <AlertDescription>
              Ces actions affectent toutes les données de l&apos;application.
              Utilisez avec précaution.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Exporter les données</h4>
                  <p className="text-sm text-gray-600">
                    Télécharger une sauvegarde complète des données
                  </p>
                </div>
              </div>
              <Button onClick={handleExportData} variant="outline" size="sm">
                Exporter
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Importer les données</h4>
                  <p className="text-sm text-gray-600">
                    Restaurer des données depuis une sauvegarde
                  </p>
                </div>
              </div>
              <Button onClick={handleImportData} variant="outline" size="sm">
                Importer
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-500" />
                <div>
                  <h4 className="font-medium text-red-700">
                    Réinitialiser les données
                  </h4>
                  <p className="text-sm text-gray-600">
                    Supprimer toutes les données et restaurer l&apos;état
                    initial
                  </p>
                </div>
              </div>
              <Button
                onClick={handleResetData}
                variant="destructive"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Réinitialisation..." : "Réinitialiser"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
