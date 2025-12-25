import { buildUserStoryQualityPrompt } from "@/lib/ai/prompts/userStoryQualityPrompt";
import {
  UserStoryQualityRequest,
  UserStoryQualityResponseSchema,
} from "@/lib/ai/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Schéma de validation de la requête entrante
 */
const RequestSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  acceptanceCriteria: z
    .string()
    .min(1, "Les critères d'acceptation sont requis"),
  code: z.string().optional(),
  priority: z.string().optional(),
});

/**
 * POST /api/ai/us-quality
 * Analyse la qualité d'une User Story via IA
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser et valider le body
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    // 2. Construire le prompt
    const prompt = buildUserStoryQualityPrompt(
      validatedData as UserStoryQualityRequest
    );

    // 3. Appel IA (stub pour Vercel AI SDK + Chutes)
    // TODO: Remplacer par l'intégration Chutes réelle
    const aiResponse = await callChutesAI(prompt);

    // 4. Parser et valider la réponse JSON
    const parsedResponse = JSON.parse(aiResponse);
    const validatedResponse =
      UserStoryQualityResponseSchema.parse(parsedResponse);

    // 5. Retourner la réponse validée
    return NextResponse.json(
      {
        success: true,
        data: {
          analysis: validatedResponse,
          version: "v1.0.0",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'analyse de qualité:", error);

    // Gestion des erreurs Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de l'analyse",
      },
      { status: 500 }
    );
  }
}

/**
 * STUB pour l'appel à Chutes via Vercel AI SDK
 *
 * TODO: Remplacer par l'implémentation réelle :
 *
 * import { generateText } from 'ai';
 * import { createChutes } from '@ai-sdk/chutes'; // ou l'import correct
 *
 * const chutes = createChutes({
 *   apiKey: process.env.CHUTES_API_KEY,
 * });
 *
 * const { text } = await generateText({
 *   model: chutes('nom-du-modèle'),
 *   prompt: prompt,
 * });
 *
 * return text;
 */
async function callChutesAI(prompt: string): Promise<string> {
  // Simulation pour V1 (remplacer par l'appel réel)
  console.log("🔄 Appel IA (STUB) - Prompt length:", prompt.length);

  // Mock response pour tester l'intégration
  const mockResponse = {
    scores: {
      clarity: 7,
      testability: 6,
      risk: 4,
    },
    alerts: [
      {
        severity: "medium" as const,
        message: "Les critères d'acceptation pourraient être plus mesurables",
      },
      {
        severity: "low" as const,
        message: "La description manque de contexte utilisateur",
      },
    ],
    questionsForBusiness: [
      "Quel est le volume de données attendu pour cette fonctionnalité ?",
      "Y a-t-il des contraintes de performance spécifiques ?",
      "Quels sont les cas limites à gérer ?",
    ],
    gherkinSuggestions: [
      {
        scenario: "Scénario nominal",
        given: "Un utilisateur authentifié sur la plateforme",
        when: "Il accède à la fonctionnalité",
        then: "Il peut accomplir l'action décrite",
      },
    ],
    investGuidelines: {
      independent: true,
      negotiable: true,
      valuable: true,
      estimable: false,
      small: true,
      testable: false,
    },
  };

  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 800));

  return JSON.stringify(mockResponse);
}
