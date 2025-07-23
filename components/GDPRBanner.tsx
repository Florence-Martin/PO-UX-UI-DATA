"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Info, Shield } from "lucide-react";
import Link from "next/link";

export function GDPRBanner() {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Left side - Info */}
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Confidentialité et RGPD
                </h3>
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Conforme
                </div>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Cette application de démonstration ne collecte{" "}
                <strong>aucune donnée personnelle</strong>. Toutes les données
                sont anonymes et utilisées uniquement pour illustrer les
                fonctionnalités d&apos;un outil Product Owner.
              </p>
            </div>
          </div>

          {/* Right side - Quick stats and CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">
                <Info className="h-3 w-3" />
                Score RGPD: 85/100
              </div>
              <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">
                <CheckCircle2 className="h-3 w-3" />
                Données anonymes
              </div>
            </div>

            <Link href="/privacy-policy">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                <Shield className="w-3 h-3 mr-1" />
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
