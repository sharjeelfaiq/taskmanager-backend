import Joi from "joi";

export const createTaskDto = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow("").optional(),
});

export const updateTaskDto = Joi.object({
  title: Joi.string().trim().min(1),
  description: Joi.string().trim().allow(""),
  completed: Joi.boolean(),
}).min(1);
