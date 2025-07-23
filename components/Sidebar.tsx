"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Database,
  FileSearch,
  LayoutDashboard,
  Menu,
  Shield,
  SquareKanban,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  {
    name: "Dashboard UX/Data",
    href: "/",
    icon: LayoutDashboard,
    description: "Vue d'ensemble des KPIs UX et Data du produit",
  },
  {
    name: "Analysis & Wireframes",
    href: "/analysis",
    icon: FileSearch,
    description: "Analyse utilisateur, wireframes et recherche UX",
  },
  {
    name: "Product Backlog",
    href: "/backlog",
    icon: SquareKanban,
    description: "Toutes les user stories et tâches produit",
  },
  {
    name: "Sprint Management",
    href: "/sprint",
    icon: SquareKanban,
    description: "Planification, exécution et mesure des sprints",
  },
  {
    name: "KPIs & BI Tracking",
    href: "/metrics",
    icon: Database,
    description: "Suivi des indicateurs métier et analytics",
  },
  {
    name: "Product QA & Checklists",
    href: "/validation",
    icon: CheckSquare,
    description: "Contrôle qualité, checklists et tests produits",
  },
  {
    name: "Agile Glossary & Methods",
    href: "/scrum-glossary",
    icon: UsersRound,
    description: "Glossaire des termes et méthodes agiles Scrum",
  },
];

export function Sidebar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Fermer la sidebar par défaut si l’écran est petit
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold">UX Data PO Kit</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4">X</span>
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 p-2">
        <TooltipProvider delayDuration={100}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                      isActive ? "bg-accent" : "transparent",
                      isCollapsed && "justify-center"
                    )}
                    aria-label={item.name}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.description}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
      <div className="mt-auto p-4 space-y-2">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <Link
              href="/privacy-policy"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex-1"
            >
              <Shield className="h-3 w-3" />
              Politique de confidentialité
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
