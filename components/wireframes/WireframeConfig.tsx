"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WireframeGrid } from "@/lib/services/wireframeService";
import { Settings } from "lucide-react";
import { useState } from "react";

interface WireframeConfigProps {
  grid: WireframeGrid;
  onConfigUpdate: (cols: number, rows: number) => Promise<void>;
  isLoading?: boolean;
}

export function WireframeConfig({
  grid,
  onConfigUpdate,
  isLoading = false,
}: WireframeConfigProps) {
  const [cols, setCols] = useState(grid.gridSize.cols);
  const [rows, setRows] = useState(grid.gridSize.rows);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (cols < 1 || rows < 1 || cols > 8 || rows > 6) {
      alert("Colonnes: 1-8, Lignes: 1-6");
      return;
    }

    try {
      setUpdating(true);
      await onConfigUpdate(cols, rows);
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      alert("Erreur lors de la mise à jour de la grille");
    } finally {
      setUpdating(false);
    }
  };

  const hasChanges = cols !== grid.gridSize.cols || rows !== grid.gridSize.rows;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cols">Colonnes</Label>
          <Input
            id="cols"
            type="number"
            min="1"
            max="8"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Min: 1, Max: 8</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rows">Lignes</Label>
          <Input
            id="rows"
            type="number"
            min="1"
            max="6"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Min: 1, Max: 6</p>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleUpdate}
            disabled={!hasChanges || updating || isLoading}
            className="w-full"
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mise à jour...
              </>
            ) : (
              "Appliquer"
            )}
          </Button>
        </div>

        {hasChanges && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            ⚠️ Les changements supprimeront les images existantes
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            Configuration actuelle: {grid.gridSize.cols}×{grid.gridSize.rows}
          </div>
          <div>
            Nouvelle configuration: {cols}×{rows}
          </div>
          <div>Total de cases: {cols * rows}</div>
        </div>
      </CardContent>
    </Card>
  );
}
