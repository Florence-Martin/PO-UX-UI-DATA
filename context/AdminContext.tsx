"use client";

import { createContext, useContext, useState } from "react";

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: true, // Pour l'instant, on considère toujours admin
  loading: false,
  setIsAdmin: () => {},
});

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true); // Toujours admin pour l'instant
  const [loading] = useState(false);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
