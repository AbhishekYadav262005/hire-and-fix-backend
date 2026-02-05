const ExpressError = require("../utils/error/expresserror.js");

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ExpressError(403, "Access denied");
    }
    next();
  };
};

module.exports = allowRoles;
