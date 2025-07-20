"use client";

import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";

export function AdminAuth() {
  const { isAdmin, setIsAdmin } = useAdmin();

  return (
    <div className="flex items-center gap-4">
      <span>Status: {isAdmin ? "Admin" : "Utilisateur"}</span>
      <Button
        variant={isAdmin ? "destructive" : "default"}
        size="sm"
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? "Se déconnecter" : "Se connecter comme Admin"}
      </Button>
    </div>
  );
}
