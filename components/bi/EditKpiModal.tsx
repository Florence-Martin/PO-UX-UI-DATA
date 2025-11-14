"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateDocumentedKPI,
  type DocumentedKPI,
} from "@/lib/services/documentedKPIService";
import { logger } from "@/lib/utils/logger";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditKpiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: DocumentedKPI;
  onSuccess?: () => void;
}

const categoryOptions = [
  { value: "product", label: "Produit" },
  { value: "agile", label: "Agile" },
  { value: "business", label: "Business" },
  { value: "ux/quality", label: "UX/Qualité" },
  { value: "delivery", label: "Livraison" },
  { value: "team", label: "Équipe" },
  { value: "roi", label: "ROI" },
  { value: "other", label: "Autre" },
];

const frequencyOptions = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
];

const visualizationOptions = [
  { value: "line", label: "Graphique linéaire" },
  { value: "bar", label: "Graphique à barres" },
  { value: "pie", label: "Graphique circulaire" },
  { value: "gauge", label: "Jauge" },
  { value: "table", label: "Tableau" },
];

export function EditKpiModal({
  open,
  onOpenChange,
  kpi,
  onSuccess,
}: EditKpiModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: kpi.name,
    definition: kpi.definition,
    category: kpi.category || "",
    frequency: kpi.frequency,
    owner: kpi.owner || "",
    target: kpi.target || "",
    dataSources: kpi.dataSources?.join(", ") || "",
    visualizationType: kpi.visualizationType || "",
  });

  // Reset form when modal opens with new KPI
  useEffect(() => {
    if (open) {
      setFormData({
        name: kpi.name,
        definition: kpi.definition,
        category: kpi.category || "",
        frequency: kpi.frequency,
        owner: kpi.owner || "",
        target: kpi.target || "",
        dataSources: kpi.dataSources?.join(", ") || "",
        visualizationType: kpi.visualizationType || "",
      });
    }
  }, [open, kpi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (
        !formData.name.trim() ||
        !formData.definition.trim() ||
        !formData.owner.trim()
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      // Parse data sources
      const dataSourcesArray = formData.dataSources
        ? formData.dataSources
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

      // Update KPI
      await updateDocumentedKPI(kpi.id, {
        name: formData.name.trim(),
        definition: formData.definition.trim(),
        category: (formData.category || undefined) as any,
        frequency: formData.frequency,
        owner: formData.owner.trim(),
        target: formData.target.trim() || undefined,
        dataSources: dataSourcesArray,
        visualizationType: (formData.visualizationType || undefined) as any,
      });

      toast.success("KPI mis à jour avec succès");
      onOpenChange(false);

      // Trigger refresh
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      logger.error("Error updating KPI:", error);
      toast.error("Erreur lors de la mise à jour du KPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le KPI</DialogTitle>
          <DialogDescription>
            Modifiez les informations du KPI documenté. Les champs marqués
            d&apos;un astérisque (*) sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nom du KPI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Taux de satisfaction utilisateur"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-definition">
              Définition <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="edit-definition"
              value={formData.definition}
              onChange={(e) =>
                setFormData({ ...formData, definition: e.target.value })
              }
              placeholder="Description détaillée du KPI et de son calcul..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-frequency">Fréquence</Label>
              <Select
                value={formData.frequency}
                onValueChange={(
                  value: "daily" | "weekly" | "monthly" | "quarterly"
                ) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger id="edit-frequency">
                  <SelectValue placeholder="Sélectionner une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-owner">
              Responsable <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-owner"
              value={formData.owner}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              placeholder="Ex: Product Owner"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-target">Objectif cible</Label>
            <Input
              id="edit-target"
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: e.target.value })
              }
              placeholder="Ex: 85% de satisfaction, <5% de bugs critiques"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dataSources">Sources de données</Label>
            <Input
              id="edit-dataSources"
              value={formData.dataSources}
              onChange={(e) =>
                setFormData({ ...formData, dataSources: e.target.value })
              }
              placeholder="Séparez par des virgules: Google Analytics, Firebase, Sondages..."
            />
            <p className="text-xs text-muted-foreground">
              Séparez les sources par des virgules
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-visualization">Type de visualisation</Label>
            <Select
              value={formData.visualizationType}
              onValueChange={(value) =>
                setFormData({ ...formData, visualizationType: value })
              }
            >
              <SelectTrigger id="edit-visualization">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {visualizationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
