const { AuthError } = require("../errors/error");

module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return next(AuthError("Authentication required"));
  }

  // ✅ normalize user object
  req.user = req.session.user;

  next();
};
