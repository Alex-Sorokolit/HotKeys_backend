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
hotKeyRouter.get("/hotkeys", authenticate, asyncHandler(getAllHotKeys));

// ❌ видалити всі hotkeys даної категорії
hotKeyRouter.delete(
  "/hotkeys/category/:id",
  authenticate,
  isValidId,
  asyncHandler(removeAllbyCategory)
);

module.exports = hotKeyRouter;
