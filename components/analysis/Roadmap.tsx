"use client";

import { useState } from "react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { RoadmapCard } from "./RoadmapCard";
import { AddQuarterForm } from "./AddQuarterForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FlagTriangleRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoadmapQuarter } from "@/lib/types/roadmapQuarter";
import { toast } from "sonner";

export default function Roadmap() {
  const { roadmap, loading, addQuarter, updateQuarter } = useRoadmap();

  const [selectedQuarter, setSelectedQuarter] = useState<RoadmapQuarter | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (quarter: RoadmapQuarter) => {
    setSelectedQuarter(quarter);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setSelectedQuarter(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedQuarter(null);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <FlagTriangleRight className="w-5 h-5" />
        Roadmap du projet UX Data PO Kit
      </h3>

      {/* Intro texte */}
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Cette roadmap présente les jalons clés prévus pour le développement
          progressif de l’application UX Data PO Kit. Elle est susceptible
          d’évoluer en fonction des retours utilisateurs, des priorités produit
          et des besoins identifiés au fil de l’usage de l’outil lui-même.
        </CardContent>
      </Card>

      {/* Bouton + Modale */}
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" /> Ajouter un trimestre
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-semibold">
              {selectedQuarter
                ? "Modifier le trimestre"
                : "Ajouter un trimestre"}
            </DialogTitle>

            <AddQuarterForm
              initialData={selectedQuarter || undefined}
              onSubmit={async (quarter) => {
                try {
                  if (selectedQuarter) {
                    await updateQuarter(quarter);
                  } else {
                    await addQuarter(quarter);
                  }
                  toast.success("✅ Trimestre sauvegardé !");
                  setSelectedQuarter(null);
                  setIsOpen(false);
                } catch (error) {
                  toast.error("❌ Erreur lors de la sauvegarde");
                  console.error(error);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Affichage des trimestres */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Chargement des données...
        </div>
      ) : (
        <div className="space-y-6">
          {roadmap.map((quarter) => (
            <RoadmapCard key={quarter.id} data={quarter} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
