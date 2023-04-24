const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticate, isValidId } = require("../middlewares");
const {
  CategoryCtrl: { addCategory, removeCategory, getAllCategories },
} = require("../controllers");

// Створення роутера
const categoryRouter = express.Router();

// ✅ Додати категорію
categoryRouter.post("/categories", authenticate, asyncHandler(addCategory));

// ❌ Видалити категорію
categoryRouter.delete(
  "/categories/:id",
  authenticate,
  isValidId,
  asyncHandler(removeCategory)
);

// ⏹️ Отримати список всіх категорій
categoryRouter.get("/categories", authenticate, asyncHandler(getAllCategories));
module.exports = categoryRouter;
