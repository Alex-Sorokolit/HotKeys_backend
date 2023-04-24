const { HotKey } = require("../models/hotkey");

class HotKeyController {
  // ✅ Додавання hotkey
  async addHotkey(req, res) {
    const { category, shortcut, description } = req.body;

    if (!category || !shortcut || !description) {
      res.status(400);
      throw new Error("Controller: Please provide all fields");
    }

    // дістаємо id із об'єкта запиту і перейменовуємо в owner
    const { _id: owner } = req.user;

    const result = await HotKey.create({
      ...req.body,
      owner,
    });

    // перевірка чи додався документ у базу даних
    if (!result) {
      res.status(500);
      throw new Error("Server Error");
    }
    res.status(201).json({
      code: 201,
      message: "success",
      data: result,
    });
  }

  // ❌ Видалення hotkey
  async removeHotKey(req, res) {
    const { id: hotkeyId } = req.params;
    const { _id: userId } = req.user;

    if (!hotkeyId) {
      res.status(400);
      throw new Error("Controller: hotkeyId is required");
    }

    // знайти документ по id і перевірити чи належить він користувачу
    const result = await HotKey.findOne({
      _id: hotkeyId,
      owner: userId,
    });

    // перевірка чи видалився документ із бази даних
    if (!result) {
      res.status(400);
      throw new Error("Controller: Category not found");
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "HotKey deleted",
      data: result,
    });
  }

  // 🟨 Редагування hotkey
  async updateHotkey(req, res) {
    const { id: hotkeyId } = req.params;
    const { _id: userId } = req.user;

    if (!hotkeyId) {
      res.status(400);
      throw new Error("Controller: hotkeyId is required");
    }

    // якщо користувач змінив одне із полів то знайти в базі і обновити
    const changedFields = { ...req.body };
    // console.log(changedFields);

    if (!changedFields) {
      res.status(400);
      throw new Error("Controller: Please provide fields for update");
    }

    const result = await HotKey.findByIdAndUpdate(hotkeyId, changedFields, {
      new: true,
    });

    // перевірка чи оновився документ у базі даних
    if (!result) {
      res.status(500);
      throw new Error("Server Error");
    }
    res.status(200).json({
      code: 200,
      message: "success",
      data: result,
    });
  }

  // ⏹️ Отримати всі hotkey by user
  async getAllHotKeys(req, res) {
    const { _id: userId } = req.user;
    const result = await HotKey.find({ owner: userId });

    if (!result) {
      res.status(400);
      throw new Error("Controller: HotKeys not found");
    }

    res.json({
      status: "success",
      code: 200,
      message: "Own HotKeys",
      data: result,
      quantity: result.length,
    });
  }

  // ❌ видалити всі hotkeys даної категорії
  async removeAllbyCategory(req, res) {
    const { id: categoryId } = req.params;
    const { _id: userId } = req.user;

    if (!categoryId) {
      res.status(400);
      throw new Error("Controller: categoryId is required");
    }
    // знайти hotkeys по id категорії і перевірити чи належить вона користувачу
    const result = await HotKey.find({ category: categoryId, owner: userId });

    if (!result) {
      res.status(400);
      throw new Error("Controller: HotKeys not found");
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "HotKeys deleted",
      data: result,
    });
  }
}

const HotKeyCtrl = new HotKeyController();
module.exports = HotKeyCtrl;
