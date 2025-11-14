"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import {
  createDashboardKPI,
  deleteDashboardKPI,
  generateSampleDashboardKPIs,
  getKPILabel,
} from "@/lib/services/dashboardKPIService";
import { Database, Plus, RefreshCw, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardKPIAdmin() {
  const { kpis, aggregatedKpis, stats, refetch, loading, hasData } =
    useDashboardKPIs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "conversion" as "conversion" | "bounce" | "scroll" | "engagement",
    label: "",
    value: "",
    previousValue: "",
    description: "",
  });

  const kpiTypes = [
    { value: "conversion", label: "Taux de Conversion" },
    { value: "bounce", label: "Taux de Rebond" },
    { value: "scroll", label: "Taux de Scroll" },
    { value: "engagement", label: "Taux d'Engagement" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDashboardKPI({
        type: formData.type,
        label: formData.label || getKPILabel(formData.type),
        value: parseFloat(formData.value),
        previousValue: parseFloat(formData.previousValue),
        unit: "%",
        description: formData.description,
        date: new Date(),
      });

      toast.success("KPI ajouté avec succès!");
      setFormData({
        type: "conversion",
        label: "",
        value: "",
        previousValue: "",
        description: "",
      });
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du KPI");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateSampleData = async () => {
    setIsSubmitting(true);
    try {
      await generateSampleDashboardKPIs();
      toast.success("KPIs de démonstration générés!");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la génération des KPIs");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDashboardKPI(id);
      toast.success("KPI supprimé");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Statistiques des KPIs UX</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Total KPIs</p>
              <p className="font-bold text-lg">{stats.totalKPIs}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">En amélioration</p>
              <p className="font-bold text-lg text-green-600">
                {stats.improvingKPIs}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">En baisse</p>
              <p className="font-bold text-lg text-red-600">
                {stats.decliningKPIs}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Stables</p>
              <p className="font-bold text-lg text-gray-600">
                {stats.stableKPIs}
              </p>
            </div>
          </div>
          {!hasData && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              📊 Actuellement en mode démonstration - Générez des données pour
              tester les fonctionnalités.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateSampleData}
              disabled={isSubmitting}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Générer KPIs UX de démonstration
            </Button>
            <Button onClick={refetch} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Les KPIs de démonstration incluent les métriques UX essentielles :
            conversion, rebond, scroll et engagement avec des valeurs réalistes.
          </p>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un KPI UX</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de KPI</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kpiTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label">Label personnalisé (optionnel)</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Laissez vide pour utiliser le label par défaut"
                />
              </div>

              <div>
                <Label htmlFor="value">Valeur actuelle (%)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="4.28"
                  required
                />
              </div>

              <div>
                <Label htmlFor="previousValue">Valeur précédente (%)</Label>
                <Input
                  id="previousValue"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.previousValue}
                  onChange={(e) =>
                    setFormData({ ...formData, previousValue: e.target.value })
                  }
                  placeholder="3.68"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du KPI..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter le KPI"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des KPIs existants */}
      <Card>
        <CardHeader>
          <CardTitle>
            KPIs actuels ({aggregatedKpis.length} uniques, {kpis.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aggregatedKpis.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun KPI trouvé. Générez des données de démonstration pour
              commencer.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {aggregatedKpis.map((kpi) => {
                const change = kpi.value - kpi.previousValue;
                const changePercent =
                  kpi.previousValue > 0
                    ? Math.abs(change / kpi.previousValue) * 100
                    : 0;
                const isPositive =
                  kpi.type === "bounce" ? change < 0 : change > 0;

                return (
                  <div
                    key={kpi.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium flex items-center space-x-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {kpiTypes.find((t) => t.value === kpi.type)?.label}
                        </span>
                        <span className="font-bold">
                          {kpi.value.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Précédent: {kpi.previousValue.toFixed(2)}% • Changement:{" "}
                        {change > 0 ? "+" : ""}
                        {change.toFixed(2)}% ({changePercent.toFixed(1)}%) •
                        {new Date(kpi.date).toLocaleDateString("fr-FR")}
                      </div>
                      {kpi.description && (
                        <div className="text-xs text-muted-foreground italic">
                          {kpi.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          Math.abs(change) < 0.1
                            ? "bg-gray-100 text-gray-600"
                            : isPositive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {Math.abs(change) < 0.1
                          ? "Stable"
                          : isPositive
                          ? "↗️ Amélioration"
                          : "↘️ Baisse"}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(kpi.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {hasData && kpis.length > aggregatedKpis.length && (
        <Card>
          <CardHeader>
            <CardTitle>
              Historique complet ({kpis.length - aggregatedKpis.length} entrées
              historiques)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les données ci-dessus montrent les KPIs les plus récents de chaque
              type. Il y a {kpis.length - aggregatedKpis.length} entrées
              historiques supplémentaires stockées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
