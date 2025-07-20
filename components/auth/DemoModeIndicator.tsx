"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function DemoModeIndicator() {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertDescription className="flex items-center gap-2">
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          DEMO
        </Badge>
        Mode démonstration - Les données peuvent être réinitialisées
        automatiquement
      </AlertDescription>
    </Alert>
  );
}
