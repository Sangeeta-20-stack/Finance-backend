import Joi from "joi";

export const createRecordSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  amount: Joi.number().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().min(2).max(50).required(),
  note: Joi.string().allow("").max(300),
  date: Joi.date().required(),
});

export const updateRecordSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  amount: Joi.number(),
  type: Joi.string().valid("income", "expense"),
  category: Joi.string().min(2).max(50),
  note: Joi.string().allow("").max(300),
  date: Joi.date(),
}).min(1);

/* optional: query validation */
export const recordQuerySchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  type: Joi.string().valid("income", "expense"),
  category: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  q: Joi.string().allow(""),
});