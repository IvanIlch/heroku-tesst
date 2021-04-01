const express = require("express");
const router = express.Router();
const upload = require("../../../helpers/multer");
const connectWatch = require("../../../helpers/connectWatch");
const usersController = require("../../../controllers/users-controller");
// const path = require("path");
// const fs = require("fs").promises;
// const Jimp = require("jimp");
// require("dotenv").config();

router.patch(
  "/users/avatars",
  connectWatch,
  upload.single("avatar"),
  usersController.avatars
);

router.post("/upload", upload.single("avatar"), usersController.saveImage);

module.exports = router;
