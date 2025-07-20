"use client";

import { useAdmin } from "@/context/AdminContext";

export function AdminStatus() {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <span className="text-gray-500">Chargement...</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isAdmin ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={isAdmin ? "text-green-600" : "text-red-600"}>
        {isAdmin ? "Admin" : "Utilisateur"}
      </span>
    </div>
  );
}
