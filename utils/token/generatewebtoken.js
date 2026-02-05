const jwt = require("jsonwebtoken");

const generateToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = generateToken;
