import Joi from "joi";

/* update user profile */
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

/* admin role update */
export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
});

/* optional: create user (admin) */
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});