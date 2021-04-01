const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/users");
const uploadAvatar = require("./routes/api/upload");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("", uploadAvatar);

app.use(express.static(path.join(__dirname, "public")));
app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err,
    data: "Internal Server Error",
  });
});

module.exports = app;
