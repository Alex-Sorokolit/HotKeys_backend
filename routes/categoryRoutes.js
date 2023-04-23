const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticate } = require("../middlewares");
const {
  CategoryCtrl: { addCategory, removeCategory, getAllCategories },
} = require("../controllers");
// Створення роутера
const categoryRouter = express.Router();
// ✅ Додати категорію
categoryRouter.post("/categories", authenticate, asyncHandler(addCategory));
// ❌ Видалити категорію

// ⏹️ Отримати список всіх категорій

module.exports = categoryRouter;
