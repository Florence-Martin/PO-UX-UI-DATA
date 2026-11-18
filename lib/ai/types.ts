import { z } from "zod";

/**
 * Schéma Zod pour la réponse de l'IA (analyse de qualité d'une User Story)
 */
export const UserStoryQualityResponseSchema = z.object({
  scores: z.object({
    clarity: z.number().min(0).max(10),
    testability: z.number().min(0).max(10),
    risk: z.number().min(0).max(10),
  }),
  alerts: z.array(
    z.object({
      severity: z.enum(["low", "medium", "high"]),
      message: z.string().max(4000),
    })
  ).max(50),
  questionsForBusiness: z.array(z.string().max(4000)).max(50),
  gherkinSuggestions: z.array(
    z.object({
      scenario: z.string().max(4000),
      given: z.string().max(4000),
      when: z.string().max(4000),
      then: z.string().max(4000),
    })
  ).max(50),
  investGuidelines: z
    .object({
      independent: z.boolean().optional(),
      negotiable: z.boolean().optional(),
      valuable: z.boolean().optional(),
      estimable: z.boolean().optional(),
      small: z.boolean().optional(),
      testable: z.boolean().optional(),
    })
    .optional(),
});

export type UserStoryQualityResponse = z.infer<
  typeof UserStoryQualityResponseSchema
>;

/**
 * Types pour la requête API
 */
export interface UserStoryQualityRequest {
  title: string;
  description: string;
  acceptanceCriteria: string;
  code?: string;
  priority?: string;
}

/**
 * Résultat complet avec métadonnées
 */
export interface UserStoryQualityResult {
  id?: string;
  userStoryId?: string;
  analysis: UserStoryQualityResponse;
  createdAt: Date;
  version: string; // Version du modèle/prompt utilisé
}
