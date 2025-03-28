import { Card } from "@/components/ui/card";
import { Map } from "lucide-react";
import Link from "next/link";

const steps = [
  { id: 1, label: "Analyse des besoins", progress: 60 },
  { id: 2, label: "Wireframes", progress: 0 },
  { id: 3, label: "User Stories", progress: 33 },
  { id: 4, label: "Backlog & Kanban", progress: 50 },
  { id: 5, label: "Livrables & Qualité", progress: 0 },
];

export function RoadmapFlow() {
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

            <Card className="w-full sm:w-[180px] p-4 text-center border border-blue-100 bg-card hover:ring-2 ring-ring transition-shadow">
              <div className="text-sm text-muted-foreground font-medium mb-1">
                {step.label}
              </div>
              <div className="text-xl font-semibold text-foreground mt-auto">
                {step.progress}%
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
