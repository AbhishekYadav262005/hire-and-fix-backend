const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/error/expresserror.js");
const User = require("../models/userModel.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log("AUTH MIDDLEWARE HIT");
    if (!token) {
      throw new ExpressError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ExpressError(401, "User not found");
    }

    req.user = user; 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired, please login again",
      });
    }

    return res.status(err.statusCode || 401).json({
      error: err.message || "Invalid or missing token",
    });
  }
};

module.exports = authMiddleware;
