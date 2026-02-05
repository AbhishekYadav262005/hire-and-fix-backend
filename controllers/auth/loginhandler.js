const User = require("../../models/userModel.js");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../../utils/auth/hashpassword.js");
const ExpressError = require("../../utils/error/expresserror.js");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const loginHandler = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "All Fields are Required" });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, include a lowercase letter, a number, and a special character.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
  
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    const isProd = (process.env.NODE_ENV || "development") === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = loginHandler;
