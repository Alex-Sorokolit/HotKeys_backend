const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticate } = require("../middlewares");

// створення роутера
const hotKeyRouter = express.Router();

// ✅ Додавання hotkey
hotKeyRouter.post("/hotkeys", authenticate);
// ❌ Видалення hotkey by id
// 🟨 Редагування hotkey by id
// ⏹️ Отримати всі hotkey by user
// ❌ видалити всі hotkeys даної категорії

module.exports = hotKeyRouter;
