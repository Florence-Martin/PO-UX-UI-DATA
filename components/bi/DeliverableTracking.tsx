"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export function DeliverableTracking() {
  const deliverables = [
    {
      id: "1",
      name: "Dashboard Conversion",
      status: "completed",
      dueDate: "2024-03-15",
      owner: "Équipe BI",
    },
    {
      id: "2",
      name: "Rapport Cohort Analysis",
      status: "in_progress",
      dueDate: "2024-03-25",
      owner: "Équipe Data",
    },
    {
      id: "3",
      name: "KPIs Rétention",
      status: "delayed",
      dueDate: "2024-03-10",
      owner: "Équipe BI",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "delayed":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-[400px] sm:h-[500px]">
      <div className="space-y-4">
        {deliverables.map((deliverable) => (
          <Card
            key={deliverable.id}
            className="sm:flex sm:items-center sm:justify-between"
          >
            <CardContent className="p-4 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                <div className="flex items-start space-x-4 w-full sm:w-auto">
                  {getStatusIcon(deliverable.status)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm sm:text-base">
                      {deliverable.name}
                    </h4>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {deliverable.owner} • Échéance : {deliverable.dueDate}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 sm:flex-shrink-0">
                  {getStatusBadge(deliverable.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
