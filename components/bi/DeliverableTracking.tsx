"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Deliverable } from "@/lib/services/deliverableService";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Flag,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AddDeliverableModal } from "./AddDeliverableModal";
import { DeleteDeliverableModal } from "./DeleteDeliverableModal";
import { EditDeliverableModal } from "./EditDeliverableModal";

interface DeliverableTrackingProps {
  deliverables: Deliverable[];
}

export function DeliverableTracking({
  deliverables,
}: DeliverableTrackingProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<Deliverable | null>(null);
  const [deletingDeliverable, setDeletingDeliverable] =
    useState<Deliverable | null>(null);

  // Calculer les statistiques par statut
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {
      completed: 0,
      in_progress: 0,
      delayed: 0,
      pending: 0,
    };
    deliverables.forEach((d) => {
      stats[d.status] = (stats[d.status] || 0) + 1;
    });
    return stats;
  }, [deliverables]);

  // Filtrer par recherche et statut
  const filteredDeliverables = deliverables.filter((deliverable) => {
    const matchesSearch =
      deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deliverable.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      deliverable.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus
      ? deliverable.status === selectedStatus
      : true;
    return matchesSearch && matchesStatus;
  });
  const getStatusIcon = (status: Deliverable["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "delayed":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "pending":
        return <Circle className="h-6 w-6 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Deliverable["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        );
      case "delayed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Circle className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorities = {
      high: { label: "Haute", className: "bg-red-50 text-red-700" },
      medium: { label: "Moyenne", className: "bg-yellow-50 text-yellow-700" },
      low: { label: "Basse", className: "bg-green-50 text-green-700" },
    };
    const config = priorities[priority as keyof typeof priorities] || {
      label: priority,
      className: "bg-gray-50 text-gray-700",
    };
    return (
      <Badge variant="outline" className={config.className}>
        <Flag className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      agile_metrics: "Métriques Agile",
      product_analytics: "Analytics Produit",
      user_experience: "Expérience Utilisateur",
      experimentation: "Expérimentation",
      business_intelligence: "Business Intelligence",
    };
    return categories[category] || category;
  };

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {[
          {
            status: "completed",
            label: "Terminés",
            count: statusStats.completed,
            color: "bg-green-500",
            textColor: "text-green-700",
          },
          {
            status: "in_progress",
            label: "En cours",
            count: statusStats.in_progress,
            color: "bg-blue-500",
            textColor: "text-blue-700",
          },
          {
            status: "delayed",
            label: "En retard",
            count: statusStats.delayed,
            color: "bg-red-500",
            textColor: "text-red-700",
          },
          {
            status: "pending",
            label: "En attente",
            count: statusStats.pending,
            color: "bg-gray-500",
            textColor: "text-gray-700",
          },
        ].map(({ status, label, count, color, textColor }) => (
          <Card
            key={status}
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() =>
              setSelectedStatus(selectedStatus === status ? null : status)
            }
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {count}
                </div>
                <p className={`text-xs font-medium ${textColor}`}>{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un livrable..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {selectedStatus && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStatus(null)}
              className="flex items-center gap-1 flex-1 sm:flex-initial min-w-0"
            >
              <Filter className="h-4 w-4 flex-shrink-0" />
              <span className="hidden md:inline truncate">
                {
                  {
                    completed: "Terminés",
                    in_progress: "En cours",
                    delayed: "En retard",
                    pending: "En attente",
                  }[selectedStatus]
                }
              </span>
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            className="flex items-center gap-1 flex-1 sm:flex-initial"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Nouveau livrable</span>
            <span className="md:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-480px)] sm:h-[calc(100vh-420px)] md:h-[450px]">
        <div className="space-y-3">
          {filteredDeliverables.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Aucun livrable à afficher.</p>
                <p className="text-sm mt-2">
                  {selectedStatus
                    ? "Aucun livrable avec ce statut."
                    : "Les livrables BI seront affichés ici une fois créés."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDeliverables.map((deliverable) => (
              <Card
                key={deliverable.id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(deliverable.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base">
                            {deliverable.name}
                          </h4>
                          {deliverable.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                              {deliverable.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setEditingDeliverable(deliverable)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingDeliverable(deliverable)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {getStatusBadge(deliverable.status)}
                      {(deliverable as any).priority &&
                        getPriorityBadge((deliverable as any).priority)}
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2">
                      <FolderKanban className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Catégorie
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5 break-words">
                          {getCategoryLabel(
                            (deliverable as any).category || ""
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Échéance
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5 font-medium">
                          {deliverable.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Responsable
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5">
                          {deliverable.owner}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Modal d'ajout */}
      <AddDeliverableModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={() => router.refresh()}
      />

      {/* Modal d'édition */}
      {editingDeliverable && (
        <EditDeliverableModal
          open={!!editingDeliverable}
          onOpenChange={(open: boolean) => !open && setEditingDeliverable(null)}
          deliverable={editingDeliverable}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* Modal de suppression */}
      {deletingDeliverable && (
        <DeleteDeliverableModal
          open={!!deletingDeliverable}
          onOpenChange={(open: boolean) =>
            !open && setDeletingDeliverable(null)
          }
          deliverable={deletingDeliverable}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
