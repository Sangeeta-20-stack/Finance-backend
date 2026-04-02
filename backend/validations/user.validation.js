import Joi from "joi";

/* update user profile */
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

/* admin role update — fixed: "user" role does not exist, using correct roles */
export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid("viewer", "analyst", "admin").required(),
});

/* create user (admin) — fixed: correct roles */
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("viewer", "analyst", "admin").default("viewer"),
});