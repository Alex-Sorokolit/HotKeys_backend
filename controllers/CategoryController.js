const { Category } = require("../models/category");

class CategoryController {
  // Додати категорію
  async addCategory(req, res) {
    const { title } = req.body;
    if (!title) {
      res.status(400);
      throw new Error("Controller: Please provide all fields");
    }

    // дістаємо id із об'єкта запиту і перейменовуємо в owner
    const { _id: owner } = req.user;

    const result = await Category.create({
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

  // Видалити категорію
  async removeCategory(req, res) {
    const { id: categoryId } = req.params;
    const { _id: userId } = req.user;

    if (!categoryId) {
      res.status(400);
      throw new Error("Controller: categoryId is required");
    }

    // знайти категорію по id і перевірити чи належить вона користувачу
    const category = await Category.findOne({ _id: categoryId, owner: userId });

    // перевірка чи видалився документ із бази даних
    if (!category) {
      res.status(400);
      throw new Error("Controller: Category not found");
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Category deleted",
      data: result,
    });
  }
  // Отримати список всіх категорій
  async getAllCategories(req, res) {
    const { _id: userId } = req.user;

    const result = await Category.find({ owner: userId });

    // Перевірка чи знайдено документи в базі даних
    if (!result) {
      res.status(400);
      throw new Error("Controller: Categories not found");
    }

    res.json({
      status: "success",
      code: 200,
      message: "Own Categories",
      data: result,
      quantity: result.length,
    });
  }
}

const CategoryCtrl = new CategoryController();
module.exports = CategoryCtrl;
