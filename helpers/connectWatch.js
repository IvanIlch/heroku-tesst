const passport = require("passport");
require("../config/passport");

const connectWatch = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const token =
      req.headers.authorization &&
      req.headers.authorization.split(" ")[1].trim();

    if (!user || err || token !== user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        data: "Unauthorized",
        message: "Not authorized",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = connectWatch;
