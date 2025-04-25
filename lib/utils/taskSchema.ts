import Joi from "joi";
import DOMPurify from "dompurify";

// 🧼 Sanitize une string
export const sanitize = (input: string): string => DOMPurify.sanitize(input);

// ✅ Schéma de validation des tâches du backlog
export const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("todo", "inProgress", "done").required(),
  userStoryId: Joi.string().allow(null).optional(),
  createdAt: Joi.any().optional(),
  updatedAt: Joi.any().optional(),
});
