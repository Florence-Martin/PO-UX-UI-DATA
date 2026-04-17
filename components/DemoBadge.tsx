"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DemoStore } from "@/lib/demo/demoStore";
import { isDemoMode } from "@/lib/utils/demoMode";
import { Database, FlaskConical, HardDrive } from "lucide-react";
import { useState } from "react";

export function DemoBadge() {
  const [isDemo] = useState(() => isDemoMode());
  const [metadata] = useState(() =>
    isDemoMode() ? DemoStore.getMetadata() : null
  );

  if (!isDemo) return null;

  const source = metadata?.source || "unknown";
  const Icon = source === "firestore" ? Database : HardDrive;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1.5 cursor-help">
            <FlaskConical className="h-3 w-3" />
            Mode Démo
            <Icon className="h-3 w-3 opacity-60" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs max-w-[250px]">
          <p className="font-medium">Sandbox locale active</p>
          <p className="text-muted-foreground mt-1">
            Source :{" "}
            {source === "firestore" ? "Snapshot Firestore" : "Seed par défaut"}
          </p>
          {metadata?.lastImport && (
            <p className="text-muted-foreground text-[10px] mt-1">
              Import :{" "}
              {new Date(metadata.lastImport).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          )}
          <p className="text-muted-foreground text-[10px] mt-2 border-t pt-1">
            Vos modifications restent locales
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
