"use client";

import { useAdmin } from "@/context/AdminContext";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return fallback || <div>Accès non autorisé</div>;
  }

  return <>{children}</>;
}
