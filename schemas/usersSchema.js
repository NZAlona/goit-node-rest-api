import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru", "uk"] },
    })
    .required(),
  password: Joi.string().min(5).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru", "uk"] },
    })
    .required(),
  password: Joi.string().min(5).required(),
  token: Joi.string(),
});

export const emailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru", "uk"] },
    })
    .required(),
}).messages({
  "any.required": "missing required field email",
});
