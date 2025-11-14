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
  updateDeliverable,
  type Deliverable,
} from "@/lib/services/deliverableService";
import { logger } from "@/lib/utils/logger";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditDeliverableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliverable: Deliverable;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "completed", label: "Terminé" },
  { value: "in_progress", label: "En cours" },
  { value: "delayed", label: "Retardé" },
  { value: "pending", label: "En attente" },
];

export function EditDeliverableModal({
  open,
  onOpenChange,
  deliverable,
  onSuccess,
}: EditDeliverableModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: deliverable.name,
    description: deliverable.description || "",
    status: deliverable.status,
    dueDate: deliverable.dueDate,
    owner: deliverable.owner,
  });

  // Reset form when modal opens with new deliverable
  useEffect(() => {
    if (open) {
      setFormData({
        name: deliverable.name,
        description: deliverable.description || "",
        status: deliverable.status,
        dueDate: deliverable.dueDate,
        owner: deliverable.owner,
      });
    }
  }, [open, deliverable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (
        !formData.name.trim() ||
        !formData.dueDate ||
        !formData.owner.trim()
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      // Update deliverable
      await updateDeliverable(deliverable.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        dueDate: formData.dueDate,
        owner: formData.owner.trim(),
      });

      toast.success("Livrable mis à jour avec succès");
      onOpenChange(false);

      // Trigger refresh
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      logger.error("Error updating deliverable:", error);
      toast.error("Erreur lors de la mise à jour du livrable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le livrable</DialogTitle>
          <DialogDescription>
            Modifiez les informations du livrable. Les champs marqués d&apos;un
            astérisque (*) sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-deliv-name">
              Nom du livrable <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-deliv-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Tableau de bord des KPIs"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deliv-description">Description</Label>
            <Textarea
              id="edit-deliv-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description détaillée du livrable..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-deliv-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "completed" | "in_progress" | "delayed" | "pending"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-deliv-status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-deliv-dueDate">
                Date d&apos;échéance <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-deliv-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deliv-owner">
              Responsable <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-deliv-owner"
              value={formData.owner}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              placeholder="Ex: Data Analyst"
              required
            />
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
