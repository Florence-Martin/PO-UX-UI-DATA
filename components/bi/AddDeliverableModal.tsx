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
import { createDeliverable } from "@/lib/services/deliverableService";
import { logger } from "@/lib/utils/logger";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddDeliverableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDeliverableModal({
  open,
  onOpenChange,
  onSuccess,
}: AddDeliverableModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending" as "completed" | "in_progress" | "delayed" | "pending",
    dueDate: "",
    owner: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation basique
      if (!formData.name || !formData.dueDate || !formData.owner) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      await createDeliverable({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        owner: formData.owner,
      });

      toast.success("Livrable créé avec succès !");

      // Reset form
      setFormData({
        name: "",
        description: "",
        status: "pending",
        dueDate: "",
        owner: "",
        category: "",
        priority: "medium",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      logger.error("Erreur lors de la création du livrable:", error);
      toast.error("Erreur lors de la création du livrable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Livrable BI</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau livrable à suivre dans vos projets Data & BI.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">
                Nom du livrable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex: Dashboard Vélocité & Burndown"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le livrable..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="delayed">En retard</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priorité */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="agile_metrics">Métriques Agile</SelectItem>
                  <SelectItem value="product_analytics">
                    Analytics Produit
                  </SelectItem>
                  <SelectItem value="user_experience">
                    Expérience Utilisateur
                  </SelectItem>
                  <SelectItem value="experimentation">
                    Expérimentation
                  </SelectItem>
                  <SelectItem value="business_intelligence">
                    Business Intelligence
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date d'échéance */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Date d&apos;échéance <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="owner">
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="owner"
                placeholder="Ex: Data Analyst"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
                required
              />
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
              Créer le livrable
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
