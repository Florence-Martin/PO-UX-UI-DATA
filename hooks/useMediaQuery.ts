import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs

  useEffect(() => {
    try {
      // Vérifie si l'API matchMedia est disponible
      if (typeof window === "undefined" || !window.matchMedia) {
        throw new Error(
          "L'API matchMedia n'est pas disponible dans cet environnement."
        );
      }

      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      media.addEventListener("change", listener);

      return () => media.removeEventListener("change", listener);
    } catch (err) {
      console.error("Erreur dans useMediaQuery :", err);
      setError((err as Error).message || "Une erreur inconnue est survenue.");
    }
  }, [query]);

  if (error) {
    console.error(error); // Affiche l'erreur dans la console pour le débogage
  }

  return matches;
}
