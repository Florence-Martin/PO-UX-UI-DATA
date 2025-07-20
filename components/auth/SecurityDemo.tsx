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
import { Database, Shield, Users } from "lucide-react";

export function SecurityDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Démonstration de Sécurité
          </CardTitle>
          <CardDescription>
            Cette page démontre les fonctionnalités de sécurité de
            l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Mode démo activé - Tous les utilisateurs ont accès admin pour les
              tests
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Base de données</h4>
                  <p className="text-sm text-gray-600">
                    Accès complet aux données en mode démo
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Tester l&apos;accès
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Sécurité</h4>
                  <p className="text-sm text-gray-600">
                    Système de permissions simplifié
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Voir les règles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
