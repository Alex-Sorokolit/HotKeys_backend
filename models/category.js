const { model, Schema } = require("mongoose");
const Joi = require("joi");

// mongoos схема перевіряє дані які зберігаються в базу даних
const categorySchema = Schema(
  {
    title: {
      type: String,
      require: [true, "DB: title is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

// валідація Joy перевіряє тіло запиту
const categoryJoiSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Joi: Title is required",
    "string.empty": "Joi: Title cannot be empty",
  }),
}).options({ abortEarly: false, stripUnknown: true });

const Category = model("Category", categorySchema);

const schemas = {
  categoryJoiSchema,
};

module.exports = {
  Category,
  schemas,
};
