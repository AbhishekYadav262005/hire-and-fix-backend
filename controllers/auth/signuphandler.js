const User = require("../../models/userModel.js");
const { hashPassword } = require("../../utils/auth/hashpassword.js");
const ExpressError = require("../../utils/error/expresserror.js");
const { generateOTP, sendOTPEmail } = require("../../utils/auth/emailvalidateotp.js");
const otpStore = require("../../utils/auth/otpstore.js");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const trimInputs = (data) => {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string") {
      data[key] = data[key].trim();
    }
  });
  return data;
};

const signupHandler = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    ({ username, email, password, role } = trimInputs({
      username,
      email,
      password,
      role,
    }));

    if (!username || !email || !password || !role) {
      throw new ExpressError(400, "All fields are required.");
    }

    if (!["user", "worker"].includes(role)) {
      throw new ExpressError(400, "Invalid role selected.");
    }

    if (!emailRegex.test(email)) {
      throw new ExpressError(400, "Invalid email format.");
    }

    if (!passwordRegex.test(password)) {
      throw new ExpressError(
        400,
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ExpressError(409, "Email already registered.");
    }

    const hashedPassword = await hashPassword(password);

    const otp = generateOTP();
    await sendOTPEmail(email, otp);

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
      userData: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email for verification.",
    });

  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Something went wrong during signup.",
    });
  }
};

module.exports = signupHandler;
