"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  FileSearch,
  UsersRound,
  SquareKanban,
  Database,
  CheckSquare,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const navigation = [
  {
    name: "Dashboard UX/Data",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Analyse & Wireframes",
    href: "/analysis",
    icon: FileSearch,
  },
  {
    name: "Backlog & Kanban",
    href: "/backlog",
    icon: SquareKanban,
  },
  {
    name: "Sprint",
    href: "/sprint",
    icon: SquareKanban,
  },
  {
    name: "KPIs & Suivi BI",
    href: "/metrics",
    icon: Database,
  },
  {
    name: "Checklists & QA Produit",
    href: "/validation",
    icon: CheckSquare,
  },
  {
    name: "Agile Scrum method & Glossary",
    href: "/scrum-glossary",
    icon: UsersRound,
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
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent" : "transparent",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
