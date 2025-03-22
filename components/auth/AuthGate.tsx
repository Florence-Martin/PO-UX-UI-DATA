"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!user) {
    return null; // L'utilisateur sera redirigé par useEffect
  }

  return <>{children}</>;
};
