const { ForbiddenError, AuthError } = require("../errors/error");

function allowRoles(...roles) {
  return (req, res, next) => {

    /* 🔐 User must be authenticated first */
    if (!req.user) {
      return next(AuthError("Authentication required"));
    }

    /* 🚫 Role check */
    if (!roles.includes(req.user.role)) {
      return next(ForbiddenError("Access denied"));
    }

    next();
  };
}

module.exports = allowRoles;
