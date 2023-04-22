const { model, Schema } = require("mongoose");
const Joi = require("joi");

// mongoos схема перевіряє дані які зберігаються в базу даних
const hotkeySchema = Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "user", required: true },

    shortcut: {
      type: String,
      require: [true, "DB: shortcut is required"],
    },

    description: {
      type: String,
      require: [true, "DB: description is required"],
    },

    owner: { type: Schema.Types.ObjectId, ref: "user", required: true }, // тут буде зберігатися id користувача який додав контакт у базу, ref це колекція
  },
  { versionKey: false, timestamps: true }
);

// валідація Joy перевіряє тіло запиту
const hotKeyJoiSchema = Joi.object({
  shortcut: Joi.string().required().messages({
    "any.required": "Joi: Schortcut is required",
    "string.empty": "Joi: Schortcut cannot be empty",
  }),
  description: Joi.string().required().messages({
    "any.required": "Joi: Description is required",
    "string.empty": "Joi: Description cannot be empty",
  }),
}).options({ abortEarly: false, stripUnknown: true });

const HotKey = model("HotKey", hotkeySchema);

const schemas = {
  hotKeyJoiSchema,
};

module.exports = {
  HotKey,
  schemas,
};
