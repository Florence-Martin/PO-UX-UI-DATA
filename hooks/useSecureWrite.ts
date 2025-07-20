import { useAdmin } from "@/context/AdminContext";
import { useCallback, useState } from "react";

export function useSecureWrite() {
  const { isAdmin } = useAdmin();
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secureWrite = useCallback(
    async (operation: () => Promise<void>, requireAdmin: boolean = true) => {
      if (requireAdmin && !isAdmin) {
        setError("Opération non autorisée - Droits admin requis");
        return false;
      }

      setIsWriting(true);
      setError(null);

      try {
        await operation();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsWriting(false);
      }
    },
    [isAdmin]
  );

  return {
    secureWrite,
    isWriting,
    error,
    clearError: () => setError(null),
  };
}
