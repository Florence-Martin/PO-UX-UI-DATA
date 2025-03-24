"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";

export function KpiDocumentation() {
  const kpis = [
    {
      id: "1",
      name: "Taux de Conversion",
      definition: "Pourcentage d'utilisateurs qui effectuent un achat",
      source: "Google Analytics + CRM",
      objective: "4.5% à fin Q2 2024",
      frequency: "Quotidien",
      owner: "Équipe Marketing",
    },
    {
      id: "2",
      name: "Taux de Rebond",
      definition:
        "Pourcentage d'utilisateurs qui quittent le site après une seule page",
      source: "Google Analytics",
      objective: "< 30% à fin Q2 2024",
      frequency: "Quotidien",
      owner: "Équipe UX",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un KPI..." className="pl-8" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau KPI
        </Button>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <Card key={kpi.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{kpi.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {kpi.definition}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Source</Label>
                      <p className="text-sm">{kpi.source}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Objectif</Label>
                      <p className="text-sm">{kpi.objective}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Fréquence</Label>
                      <p className="text-sm">{kpi.frequency}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Responsable</Label>
                      <p className="text-sm">{kpi.owner}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
