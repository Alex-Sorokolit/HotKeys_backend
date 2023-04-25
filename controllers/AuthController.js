const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
require("dotenv").config();
const { User } = require("../models/user");
const cloudinary = require("cloudinary").v2;

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

class AuthController {
  // ✅ Google Registration
  async googleAuth(req, res) {
    const { _id: id } = req.user;

    const payload = {
      id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "23h",
    });

    await User.findByIdAndUpdate(id, { token });

    res.redirect(
      `https://romaniv2511.github.io/so-yummy/welcome?token=${token}`
    );
  }

  // ✅ Registration by Email
  async register(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    const { _id } = await User.findOne({ email });

    const payload = {
      id: _id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "23h",
    });

    const newUser = await User.findByIdAndUpdate(
      _id,
      { token },
      {
        new: true,
      }
    );

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      token: newUser.token,
      avatarURL: newUser.avatarURL,
    });
  }

  // ✅ Login
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      res.status(401).json({
        message: "Email or password invalid",
      });
      return;
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "23h",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email,
        name: user.name,
        avatar: user.avatarURL,
        createDate: user.createdAt,
      },
    });
  }

  // ⏹️ Get Current User
  async getCurrent(req, res) {
    const { email } = req.user;

    const user = await User.findOne({ email });

    res.json({
      user: {
        email,
        name: user.name,
        avatar: user.avatarURL,
        createDate: user.createdAt,
      },
    });
  }

  // 🟨 Logout
  async logout(req, res) {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
      message: "Logout success",
    });
  }

  // ⏹️ Get User Info
  async getCurrentUser(req, res) {
    const { name, email, avatarURL, createdAt } = req.user;

    res.status(200).json({
      name,
      email,
      avatarURL,
      createdAt,
    });
  }

  // 🔄️ Update User
  async updateUser(req, res) {
    const { _id: id } = req.user;

    const data = req.body;

    if (data.email) {
      const { email } = data;

      const user = await User.findOne({ email });

      if (user) {
        res.status(400).json({
          message: "This password already exists",
        });
        return;
      }
    }

    if (data.password) {
      const hashPassword = await bcrypt.hash(data.password, 10);

      await User.findByIdAndUpdate(id, {
        password: hashPassword,
      });

      res.status(200).json({
        message: "Password update",
      });
      return;
    }

    const { name, email, avatarURL, updatedAt } = await User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );

    res.status(200).json({ name, email, avatarURL, updatedAt });
  }

  // 🔄️ Update Avatar
  async updateAvatar(req, res) {
    const { _id: id } = req.user;

    if (!req.file) {
      res.status(400);
      throw new Error("Controller: Image require");
    }

    const { path } = req.file;
    const fileName = req.file.filename;

    await User.findByIdAndUpdate(id, { avatarURL: path, imageId: fileName });

    res.status(200).json({ avatarURL: path });
  }

  // ❌ Delete user
  async removeUser(req, res) {
    const { _id: userId } = req.user;

    // Шукаємо користувача по id
    const user = await User.findById(userId);

    // Видалення аватарки з Cloudinary
    if (user.avatarURL && user.imageId) {
      const publicId = user.imageId;
      await cloudinary.uploader.destroy(publicId);
    }

    // Видалення користувача
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(400);
      throw new Error("Controller: User not deleted");
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted",
      data: deletedUser,
    });
  }
}

const authCtrl = new AuthController();

module.exports = authCtrl;
