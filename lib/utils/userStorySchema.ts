// import Joi from "joi";
// import DOMPurify from "dompurify";

// export const sanitize = (input: string): string => DOMPurify.sanitize(input);

// export const userStorySchema = Joi.object({
//   title: Joi.string().min(3).max(100).required(),
//   description: Joi.string().allow("").optional(),
//   priority: Joi.string().valid("low", "medium", "high").required(),
//   storyPoints: Joi.number().min(0).required(),
//   acceptanceCriteria: Joi.string().allow("").optional(),
//   moscow: Joi.string()
//     .valid("mustHave", "shouldHave", "couldHave", "wontHave")
//     .optional(),
//   sprintId: Joi.string().allow(null).optional(),
// });
