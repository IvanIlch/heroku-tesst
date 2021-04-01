const express = require("express");
const upload = require("../../../helpers/multer");
const router = express.Router();

const usersController = require("../../../controllers/users-controller");
const connectWatch = require("../../../helpers/connectWatch");
const validate = require("./validation");

router.post("/register", validate.createUser, usersController.create);
router.post("/login", usersController.login);
router.post("/logout", connectWatch, usersController.logout);
router.get("/current", connectWatch, usersController.current);

router.patch(
  "/sub",
  connectWatch,
  validate.updateSubscription,
  usersController.updateSubscription
);

module.exports = router;
