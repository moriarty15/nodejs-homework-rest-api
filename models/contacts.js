const { Schema, model } = require("mongoose");
const Joi = require("joi");
const contactsSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  email: Joi.string().min(9).max(70).required(),
  phone: Joi.number().min(0.01).required(),
  favorite: Joi.boolean(),
});

const contactSchema = Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const joiUpdateFaviriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas: {
    add: contactsSchema,
    updateFavorite: joiUpdateFaviriteSchema,
  },
};
