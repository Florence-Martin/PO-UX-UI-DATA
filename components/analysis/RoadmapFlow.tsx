"use client";
import { Card } from "@/components/ui/card";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import { AlertCircle, Loader2, Map } from "lucide-react";
import Link from "next/link";

export function RoadmapFlow() {
  const { steps, isLoading, error } = useRoadmapProgress();

  if (error) {
    return (
      <Card className="w-full p-4 text-center border-destructive">
        <div className="flex items-center justify-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Lien vers la Roadmap – affiché uniquement en mobile */}
      <Card className="sm:hidden w-full mb-4 text-center">
        <Link
          href="/analysis"
          className="text-sm font-medium text-primary hover:underline flex items-center justify-center py-1 gap-2"
        >
          <Map className="w-4 h-4" />
          Voir la roadmap complète
        </Link>
      </Card>

      {/* Affichage en ligne uniquement en desktop */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            {/* Ligne de liaison entre les cartes (desktop uniquement) */}
            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute top-1/2 left-full w-10 h-0.5 bg-muted-foreground/40 border border-blue-100" />
            )}

            {/* ✅ Style exactement identique à l'original */}
            <Card className="w-full sm:w-[180px] p-4 text-center border">
              <div className="text-sm text-muted-foreground font-medium mb-1">
                {step.label}
              </div>
              <div className="text-xl font-semibold text-foreground mt-auto flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step.progress}%
                    <span className="text-lg">
                      {getProgressIcon(step.progress)}
                    </span>
                  </>
                )}
              </div>

              {/* ✅ Petite barre de progression ajoutée */}
              {!isLoading && (
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${getProgressBarColor(
                      step.progress
                    )}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

/// Fonctions utilitaires pour le styling
const getCardStyling = (progress: number, isLoading: boolean) => {
  if (isLoading) return "border-blue-100 bg-card";
  if (progress >= 80)
    return "border-green-200 bg-green-50 hover:ring-2 ring-green-200";
  if (progress >= 50)
    return "border-yellow-200 bg-yellow-50 hover:ring-2 ring-yellow-200";
  if (progress >= 20)
    return "border-orange-200 bg-orange-50 hover:ring-2 ring-orange-200";
  return "border-red-200 bg-red-50 hover:ring-2 ring-red-200";
};

const getProgressIcon = (progress: number) => {
  if (progress >= 80) return "🎉";
  if (progress >= 50) return "🚀";
  if (progress >= 20) return "⚡";
  return "🔄";
};

const getProgressBarColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-500";
  if (progress >= 20) return "bg-orange-500";
  return "bg-red-500";
};
