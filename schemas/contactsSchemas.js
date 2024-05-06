import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru", "uk"] },
    })
    .required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^\d{3}-?\d{3}-?\d{2}$|^\d{10}$/)
    .required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ru", "uk"] },
  }),
  phone: Joi.string()
    .length(10)
    .pattern(/^\d{3}-?\d{3}-?\d{2}$|^\d{10}$/),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "Body must have at least one field",
  });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
