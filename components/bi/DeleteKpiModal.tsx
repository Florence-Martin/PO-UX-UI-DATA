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
import {
  deleteDocumentedKPI,
  type DocumentedKPI,
} from "@/lib/services/documentedKPIService";
import { logger } from "@/lib/utils/logger";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteKpiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: DocumentedKPI;
  onSuccess?: () => void;
}

export function DeleteKpiModal({
  open,
  onOpenChange,
  kpi,
  onSuccess,
}: DeleteKpiModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteDocumentedKPI(kpi.id);
      toast.success("KPI supprimé avec succès");
      onOpenChange(false);

      // Trigger refresh
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      logger.error("Error deleting KPI:", error);
      toast.error("Erreur lors de la suppression du KPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <DialogTitle>Supprimer le KPI</DialogTitle>
              <DialogDescription>
                Cette action est irréversible
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer le KPI{" "}
            <span className="font-semibold text-foreground">
              &quot;{kpi.name}&quot;
            </span>{" "}
            ?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Toutes les données associées seront définitivement perdues.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
