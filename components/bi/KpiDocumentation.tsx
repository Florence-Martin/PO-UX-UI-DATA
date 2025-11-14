"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DocumentedKPI,
  formatFrequency,
} from "@/lib/services/documentedKPIService";
import {
  BarChart3,
  Calendar,
  Database,
  Filter,
  LineChart,
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AddKpiModal } from "./AddKpiModal";
import { DeleteKpiModal } from "./DeleteKpiModal";
import { EditKpiModal } from "./EditKpiModal";

interface KpiDocumentationProps {
  kpis: DocumentedKPI[];
}

export function KpiDocumentation({ kpis }: KpiDocumentationProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<DocumentedKPI | null>(null);
  const [deletingKpi, setDeletingKpi] = useState<DocumentedKPI | null>(null);

  // Calculer les statistiques par catégorie
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    kpis.forEach((kpi) => {
      if (kpi.category) {
        stats[kpi.category] = (stats[kpi.category] || 0) + 1;
      }
    });
    return stats;
  }, [kpis]);

  // Filtrer les KPIs par recherche et catégorie
  const filteredKpis = kpis.filter((kpi) => {
    const matchesSearch =
      kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? kpi.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const badges = {
      product: {
        label: "Produit",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      },
      agile: {
        label: "Agile",
        className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      },
      business: {
        label: "Business",
        className: "bg-green-100 text-green-800 hover:bg-green-200",
      },
      ux: {
        label: "UX",
        className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      },
      quality: {
        label: "Qualité",
        className: "bg-red-100 text-red-800 hover:bg-red-200",
      },
      marketing: {
        label: "Marketing",
        className: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      },
      sales: {
        label: "Ventes",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      },
      technical: {
        label: "Technique",
        className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      },
    };
    const config = badges[category as keyof typeof badges] || {
      label: category,
      className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case "line":
        return <LineChart className="h-4 w-4 text-blue-500" />;
      case "bar":
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case "gauge":
        return <Target className="h-4 w-4 text-purple-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {Object.entries(categoryStats).map(([category, count]) => {
          const config = {
            product: {
              label: "Produit",
              color: "bg-blue-500",
              textColor: "text-blue-700",
            },
            agile: {
              label: "Agile",
              color: "bg-purple-500",
              textColor: "text-purple-700",
            },
            business: {
              label: "Business",
              color: "bg-green-500",
              textColor: "text-green-700",
            },
            ux: {
              label: "UX",
              color: "bg-orange-500",
              textColor: "text-orange-700",
            },
            quality: {
              label: "Qualité",
              color: "bg-red-500",
              textColor: "text-red-700",
            },
          }[category as keyof typeof categoryStats] || {
            label: category,
            color: "bg-gray-500",
            textColor: "text-gray-700",
          };

          return (
            <Card
              key={category}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {count}
                  </div>
                  <p className={`text-xs font-medium ${config.textColor}`}>
                    {config.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un KPI..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">
                {
                  {
                    product: "Produit",
                    agile: "Agile",
                    business: "Business",
                    ux: "UX",
                    quality: "Qualité",
                  }[selectedCategory as keyof typeof categoryStats]
                }
              </span>
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau KPI</span>
          </Button>
        </div>
      </div>

      {/* Résultats */}
      <div className="text-sm text-muted-foreground">
        {filteredKpis.length} KPI{filteredKpis.length > 1 ? "s" : ""} trouvé
        {filteredKpis.length > 1 ? "s" : ""}
        {selectedCategory && " dans cette catégorie"}
      </div>

      <ScrollArea className="h-[calc(100vh-400px)] sm:h-[500px]">
        <div className="space-y-3 pr-4">
          {filteredKpis.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Aucun KPI documenté trouvé.</p>
                <p className="text-sm mt-2">
                  {selectedCategory
                    ? "Essayez de changer de catégorie ou de réinitialiser le filtre."
                    : 'Cliquez sur "Nouveau KPI" pour en créer un.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredKpis.map((kpi) => (
              <Card
                key={kpi.id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getVisualizationIcon(kpi.visualizationType || "line")}
                        <h4 className="font-semibold text-sm sm:text-base">
                          {kpi.name}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {kpi.definition}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {kpi.category && getCategoryBadge(kpi.category)}
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setEditingKpi(kpi)}
                          title="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingKpi(kpi)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2">
                      <Database className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Sources de données
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5 break-words">
                          {Array.isArray(kpi.dataSources)
                            ? kpi.dataSources.join(", ")
                            : kpi.source || "Non spécifié"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Objectif
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-green-600 mt-0.5 break-words">
                          {kpi.target || kpi.objective || "Non défini"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Fréquence de suivi
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5">
                          {formatFrequency(kpi.frequency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          Responsable
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5">{kpi.owner}</p>
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
      <AddKpiModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={() => router.refresh()}
      />

      {/* Modal d'édition */}
      {editingKpi && (
        <EditKpiModal
          open={!!editingKpi}
          onOpenChange={(open: boolean) => !open && setEditingKpi(null)}
          kpi={editingKpi}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* Modal de suppression */}
      {deletingKpi && (
        <DeleteKpiModal
          open={!!deletingKpi}
          onOpenChange={(open: boolean) => !open && setDeletingKpi(null)}
          kpi={deletingKpi}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
