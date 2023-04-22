const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticate } = require("../middlewares");

// створення роутера
const hotKeyRouter = express.Router();

// Додавання hotkey
hotKeyRouter.post("/hotkeys", authenticate);
// Видалення hotkey

// Редагування hotkey

// Отримати всі hotkey by user

// Отримати всі категорії користувача

module.exports = hotKeyRouter;
