import {
  UserStoryQualityRequest,
  UserStoryQualityResponse,
} from "@/lib/ai/types";
import { UserStoryQualityService } from "@/lib/services/userStoryQualityService";
import { useState } from "react";

interface UseUserStoryQualityReturn {
  analysis: UserStoryQualityResponse | null;
  isLoading: boolean;
  error: string | null;
  analyzeUserStory: (
    request: UserStoryQualityRequest,
    options?: { saveToFirestore?: boolean; userStoryId?: string }
  ) => Promise<void>;
  reset: () => void;
}

/**
 * Hook pour analyser la qualité d'une User Story
 */
export function useUserStoryQuality(): UseUserStoryQualityReturn {
  const [analysis, setAnalysis] = useState<UserStoryQualityResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUserStory = async (
    request: UserStoryQualityRequest,
    options?: { saveToFirestore?: boolean; userStoryId?: string }
  ) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Appel à l'API
      const response = await fetch("/api/ai/us-quality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'analyse");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "L'analyse a échoué");
      }

      const analysisResult = data.data.analysis;
      setAnalysis(analysisResult);

      // Sauvegarde optionnelle dans Firestore
      if (options?.saveToFirestore && options?.userStoryId) {
        try {
          await UserStoryQualityService.saveAnalysis(
            options.userStoryId,
            analysisResult,
            data.data.version
          );
          console.log("✅ Analyse sauvegardée dans Firestore");
        } catch (saveError) {
          console.warn(
            "⚠️ Impossible de sauvegarder dans Firestore:",
            saveError
          );
          // On ne bloque pas l'affichage si la sauvegarde échoue
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("❌ Erreur lors de l'analyse:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    analysis,
    isLoading,
    error,
    analyzeUserStory,
    reset,
  };
}
