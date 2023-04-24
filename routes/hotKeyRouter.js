const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticate, isValidId } = require("../middlewares");
const {
  HotKeyCtrl: {
    addHotkey,
    removeHotKey,
    updateHotkey,
    getAllHotKeys,
    removeAllbyCategory,
  },
} = require("../controllers");

// створення роутера
const hotKeyRouter = express.Router();

// ✅ Додавання hotkey
hotKeyRouter.post("/hotkeys", authenticate, asyncHandler(addHotkey));

// ❌ Видалення hotkey by id
hotKeyRouter.delete(
  "/hotkeys/:id",
  authenticate,
  isValidId,
  asyncHandler(removeHotKey)
);

// 🟨 Редагування hotkey by id
hotKeyRouter.put(
  "/hotkeys/:id",
  authenticate,
  isValidId,
  asyncHandler(updateHotkey)
);
// ⏹️ Отримати всі hotkey by user
// ❌ видалити всі hotkeys даної категорії

module.exports = hotKeyRouter;
