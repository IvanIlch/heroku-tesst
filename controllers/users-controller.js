const jwt = require("jsonwebtoken");
const User = require("../schemas/user-schema");
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const Users = require("../service/users");

const SECRET_KEY = process.env.SECRET;
const IMG_DIR = path.join(__dirname, "../", "public", "images");

async function create(req, res, next) {
  try {
    const { email } = req.body;

    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        data: "Conflict",
        message: "Email in use",
      });
    }

    const newUser = await Users.createUser(req.body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isPasswordValid = await user.validPassword(password);

    if (!user || !isPasswordValid) {
      return res.status(401).json({
        status: "error",
        code: 401,
        data: "Unauthorized",
        message: "Email or password is wrong",
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(204).json({});
  } catch (e) {
    next(e);
  }
}

async function current(req, res, next) {
  try {
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription: req.user.subscription,
        avatarURL: req.user.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const id = req.user.id;
    const subscription = req.body.subscription;
    await Users.updateSubscription(id, subscription);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription,
        avatar,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function avatars(req, res, next) {
  try {
    await saveImage(req, res, next);
    const id = req.user.id;
    console.log(req.file);
    const newURL = `http://localhost:3000/images/${req.file.originalname}`;
    const newAvatar = await Users.updateAvatar(id, newURL);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        avatarURL: newAvatar.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
}
async function saveImage(req, res, next) {
  try {
    const id = req.user.id;
    const { file } = req;
    const img = await Jimp.read(file.path);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(file.path);

    await fs.rename(file.path, path.join(IMG_DIR, file.originalname));
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  login,
  logout,
  current,
  updateSubscription,
  avatars,
  saveImage,
};
