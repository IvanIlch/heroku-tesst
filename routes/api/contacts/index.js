const express = require("express");
const router = express.Router();
const connectWatch = require("../../../helpers/connectWatch");

const contactsController = require('../../../controllers/contacts-controller');

router.get("/", connectWatch, contactsController.getAllContacts);

router.get("/:contactId", connectWatch, contactsController.getById);

router.post("/", connectWatch, contactsController.createContact);

router.delete("/:contactId", connectWatch, contactsController.deleteContact);

router.patch("/:contactId", connectWatch, contactsController.patchContact);

module.exports = router;
