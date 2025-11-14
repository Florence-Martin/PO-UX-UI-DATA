"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { createDocumentedKPI } from "@/lib/services/documentedKPIService";
import { logger } from "@/lib/utils/logger";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddKpiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddKpiModal({
  open,
  onOpenChange,
  onSuccess,
}: AddKpiModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    definition: "",
    category: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly" | "quarterly",
    owner: "",
    target: "",
    dataSources: "",
    visualizationType: "line" as "line" | "bar" | "gauge" | "funnel" | "pie",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation basique
      if (!formData.name || !formData.definition || !formData.owner) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      await createDocumentedKPI({
        name: formData.name,
        definition: formData.definition,
        category: formData.category as any,
        frequency: formData.frequency,
        owner: formData.owner,
        target: formData.target,
        dataSources: formData.dataSources
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        visualizationType: formData.visualizationType,
      });

      toast.success("KPI créé avec succès !");

      // Reset form
      setFormData({
        name: "",
        definition: "",
        category: "",
        frequency: "weekly",
        owner: "",
        target: "",
        dataSources: "",
        visualizationType: "line",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      logger.error("Erreur lors de la création du KPI:", error);
      toast.error("Erreur lors de la création du KPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau KPI</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau KPI à votre documentation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">
                Nom du KPI <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex: Feature Adoption Rate"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Définition */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="definition">
                Définition <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="definition"
                placeholder="Décrivez ce que mesure ce KPI..."
                value={formData.definition}
                onChange={(e) =>
                  setFormData({ ...formData, definition: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Produit</SelectItem>
                  <SelectItem value="agile">Agile</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="ux">UX</SelectItem>
                  <SelectItem value="quality">Qualité</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Ventes</SelectItem>
                  <SelectItem value="technical">Technique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fréquence */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="owner">
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="owner"
                placeholder="Ex: Product Owner"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
                required
              />
            </div>

            {/* Objectif */}
            <div className="space-y-2">
              <Label htmlFor="target">Objectif</Label>
              <Input
                id="target"
                placeholder="Ex: ≥ 40%"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
              />
            </div>

            {/* Sources de données */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="dataSources">Sources de données</Label>
              <Input
                id="dataSources"
                placeholder="Ex: Analytics, Mixpanel (séparées par des virgules)"
                value={formData.dataSources}
                onChange={(e) =>
                  setFormData({ ...formData, dataSources: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Séparez les sources par des virgules
              </p>
            </div>

            {/* Type de visualisation */}
            <div className="space-y-2">
              <Label htmlFor="visualizationType">Type de visualisation</Label>
              <Select
                value={formData.visualizationType}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, visualizationType: value })
                }
              >
                <SelectTrigger id="visualizationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Ligne</SelectItem>
                  <SelectItem value="bar">Barre</SelectItem>
                  <SelectItem value="gauge">Jauge</SelectItem>
                  <SelectItem value="funnel">Entonnoir</SelectItem>
                  <SelectItem value="pie">Camembert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer le KPI
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
