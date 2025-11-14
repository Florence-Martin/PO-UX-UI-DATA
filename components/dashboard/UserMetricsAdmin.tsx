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
import { useUserMetrics } from "@/hooks/useUserMetrics";
import {
  createUserMetric,
  deleteUserMetric,
  generateSampleUserMetrics,
} from "@/lib/services/userMetricsService";
import { Database, Plus, RefreshCw, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UserMetricsAdmin() {
  const { userMetrics, deviceData, refetch, loading, hasData } =
    useUserMetrics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "sessions" as "sessions" | "pageViews" | "avgDuration" | "bounceRate",
    value: "",
    device: "desktop" as "mobile" | "tablet" | "desktop",
    description: "",
  });

  const metricTypes = [
    { value: "sessions", label: "Sessions" },
    { value: "pageViews", label: "Pages vues" },
    { value: "avgDuration", label: "Durée moyenne" },
    { value: "bounceRate", label: "Taux de rebond" },
  ];

  const deviceTypes = [
    { value: "mobile", label: "Mobile" },
    { value: "tablet", label: "Tablette" },
    { value: "desktop", label: "Desktop" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createUserMetric({
        type: formData.type,
        value: parseFloat(formData.value),
        device: formData.device,
        description: formData.description,
        date: new Date(),
      });

      toast.success("Métrique utilisateur ajoutée avec succès!");
      setFormData({
        type: "sessions",
        value: "",
        device: "desktop",
        description: "",
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
      await generateSampleUserMetrics();
      toast.success("Métriques utilisateur de démonstration générées!");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la génération des métriques");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserMetric(id);
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
            <Smartphone className="h-5 w-5" />
            <span>Statistiques des Métriques Utilisateurs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Total Métriques</p>
              <p className="font-bold text-lg">{userMetrics.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Mobile</p>
              <p className="font-bold text-lg text-green-600">
                {deviceData.mobile.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tablet</p>
              <p className="font-bold text-lg text-blue-600">
                {deviceData.tablet.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Desktop</p>
              <p className="font-bold text-lg text-purple-600">
                {deviceData.desktop.toFixed(1)}%
              </p>
            </div>
          </div>
          {!hasData && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              📱 Actuellement en mode démonstration - Générez des données pour
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
              Générer métriques utilisateur de démonstration
            </Button>
            <Button onClick={refetch} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Les métriques utilisateur incluent les sessions, pages vues, durée
            moyenne et répartition par device (Mobile, Tablet, Desktop).
          </p>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une Métrique Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type de Métrique</Label>
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
                    {metricTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="device">Device</Label>
                <Select
                  value={formData.device}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, device: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((device) => (
                      <SelectItem key={device.value} value={device.value}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="1250"
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
                placeholder="Description de la métrique..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter la Métrique"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Répartition Device */}
      {deviceData && (
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">📱 Mobile</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${deviceData.mobile}%` }}
                    ></div>
                  </div>
                  <span className="font-medium min-w-[60px]">
                    {deviceData.mobile.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">📟 Tablet</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${deviceData.tablet}%` }}
                    ></div>
                  </div>
                  <span className="font-medium min-w-[60px]">
                    {deviceData.tablet.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">💻 Desktop</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${deviceData.desktop}%` }}
                    ></div>
                  </div>
                  <span className="font-medium min-w-[60px]">
                    {deviceData.desktop.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des métriques */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Utilisateur ({userMetrics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userMetrics.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune métrique trouvée. Générez des données de démonstration pour
              commencer.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {userMetrics.slice(0, 20).map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {
                          metricTypes.find((t) => t.value === metric.type)
                            ?.label
                        }
                      </span>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {
                          deviceTypes.find((d) => d.value === metric.device)
                            ?.label
                        }
                      </span>
                      <span className="font-bold">{metric.value}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(metric.date).toLocaleDateString("fr-FR")}
                      {metric.description && ` • ${metric.description}`}
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
              {userMetrics.length > 20 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  ... et {userMetrics.length - 20} autres métriques
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
