"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Layout, Link } from "lucide-react";
import { useState } from "react";

export function Wireframes() {
  const [gridSize, setGridSize] = useState({ cols: 4, rows: 3 });

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Grille de Wireframe</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-2 p-4 bg-muted rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize.rows}, 100px)`,
            }}
          >
            {Array.from({ length: gridSize.cols * gridSize.rows }).map(
              (_, i) => (
                <div
                  key={i}
                  className="bg-background border-2 border-dashed border-border rounded-md flex items-center justify-center"
                >
                  <Button variant="ghost" size="sm">
                    <Layout className="h-4 w-4" />
                  </Button>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Colonnes</Label>
              <Input
                type="number"
                value={gridSize.cols}
                onChange={(e) =>
                  setGridSize((prev) => ({
                    ...prev,
                    cols: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
                max="12"
              />
            </div>
            <div className="space-y-2">
              <Label>Lignes</Label>
              <Input
                type="number"
                value={gridSize.rows}
                onChange={(e) =>
                  setGridSize((prev) => ({
                    ...prev,
                    rows: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
                max="12"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <img
                src="/figma.svg"
                alt="Figma Logo"
                width={10}
                height={10}
                className="inline-block h-6 w-6 mr-2"
              />
              Liens Figma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="mr-2 h-4 w-4" />
              Maquettes HD
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="mr-2 h-4 w-4" />
              Design System
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
