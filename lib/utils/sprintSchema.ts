// lib/utils/sprintSchema.ts
import Joi from "joi";
import DOMPurify from "dompurify";

// Validation avec Joi
export const sprintSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  userStoryIds: Joi.array().items(Joi.string()).required(),
});

// Assainir une chaîne de caractères avec DOMPurify
// Cela permet de nettoyer le contenu HTML pour éviter les attaques XSS
// et d'autres problèmes de sécurité liés à l'injection de code avant intégration dans bdd
export const sanitize = (input: string) => {
  return DOMPurify.sanitize(input);
};
