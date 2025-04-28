// import Joi from "joi";
// import DOMPurify from "dompurify";

// // 🧼 Sanitize une string
// export const sanitize = (input: string): string => DOMPurify.sanitize(input);

// // ✅ Schéma de validation des tâches du backlog
// export const taskSchema = Joi.object({
//   id: Joi.string().optional(),
//   title: Joi.string().min(3).max(100).required(),
//   description: Joi.string().allow("").optional(),
//   status: Joi.string()
//     .valid("todo", "in-progress", "in-testing", "done")
//     .required(),
//   userStoryIds: Joi.array().items(Joi.string()).optional(),
//   badge: Joi.string().allow(null).optional(),
//   priority: Joi.string().valid("low", "medium", "high").required(),
//   storyPoints: Joi.number().integer().min(0).required(),
//   createdAt: Joi.any().optional(),
//   updatedAt: Joi.any().optional(),
// });
