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
import { useTimeSeriesMetrics } from "@/hooks/useTimeSeriesMetrics";
import {
  createTimeSeriesMetric,
  deleteTimeSeriesMetric,
  generateSampleTimeSeriesData,
} from "@/lib/services/timeSeriesService";
import { Database, LineChart, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TimeSeriesAdmin() {
  const { metrics, aggregatedData, refetch, loading, hasData } =
    useTimeSeriesMetrics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "conversion" as "conversion" | "bounce" | "scroll" | "engagement",
    value: "",
    period: "",
  });

  const kpiTypes = [
    { value: "conversion", label: "Taux de Conversion" },
    { value: "bounce", label: "Taux de Rebond" },
    { value: "scroll", label: "Taux de Scroll" },
    { value: "engagement", label: "Taux d'Engagement" },
  ];

  // Générer les options de période (6 derniers mois)
  const generatePeriodOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
      options.push({ value: period, label });
    }
    return options;
  };

  const periodOptions = generatePeriodOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTimeSeriesMetric({
        type: formData.type,
        label: kpiTypes.find((t) => t.value === formData.type)?.label || "",
        value: parseFloat(formData.value),
        period: formData.period,
        date: new Date(),
      });

      toast.success("Métrique temporelle ajoutée avec succès!");
      setFormData({
        type: "conversion",
        value: "",
        period: "",
      });
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la métrique");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateSampleData = async () => {
    setIsSubmitting(true);
    try {
      await generateSampleTimeSeriesData();
      toast.success("Données temporelles de démonstration générées!");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la génération des données");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTimeSeriesMetric(id);
      toast.success("Métrique supprimée");
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
            <LineChart className="h-5 w-5" />
            <span>Métriques Temporelles UX</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Total Métriques</p>
              <p className="font-bold text-lg">{metrics.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Périodes Complètes</p>
              <p className="font-bold text-lg">{aggregatedData.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Status</p>
              <p
                className={`font-bold text-lg ${
                  hasData ? "text-green-600" : "text-orange-600"
                }`}
              >
                {hasData ? "Données réelles" : "Mode démo"}
              </p>
            </div>
          </div>
          {!hasData && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              📊 Actuellement en mode démonstration - Les graphiques utilisent
              des données statiques.
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
              Générer données temporelles de démonstration
            </Button>
            <Button onClick={refetch} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Les données temporelles alimentent les graphiques &quot;Vue
            d&apos;ensemble&quot; avec 6 mois d&apos;historique des métriques
            UX.
          </p>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une Métrique Temporelle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="period">Période</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Valeur (%)</Label>
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
            </div>

            <Button type="submit" disabled={isSubmitting || !formData.period}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter la Métrique"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Aperçu des données agrégées */}
      {aggregatedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des Données Agrégées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Période</th>
                    <th className="text-left p-2">🎯 Conversion</th>
                    <th className="text-left p-2">🔄 Rebond</th>
                    <th className="text-left p-2">📊 Scroll</th>
                    <th className="text-left p-2">💫 Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedData.map((data, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{data.name}</td>
                      <td className="p-2">{data.conversion.toFixed(2)}%</td>
                      <td className="p-2">{data.bounce.toFixed(2)}%</td>
                      <td className="p-2">{data.scroll.toFixed(2)}%</td>
                      <td className="p-2">{data.engagement.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des métriques individuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Individuelles ({metrics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune métrique trouvée. Générez des données de démonstration pour
              commencer.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {kpiTypes.find((t) => t.value === metric.type)?.label}
                      </span>
                      <span className="font-bold">
                        {metric.value.toFixed(2)}%
                      </span>
                      <span className="text-muted-foreground">
                        • {metric.period}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ajouté le{" "}
                      {new Date(metric.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(metric.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
