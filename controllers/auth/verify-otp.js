const User = require("../../models/userModel.js");
const ExpressError = require("../../utils/error/expresserror.js");
const otpStore = require("../../utils/auth/otpstore.js");
const generateToken = require("../../utils/token/generatewebtoken.js");
const generateAndUploadQRCode = require("../../utils/qr/generateAndUploadQRCode.js");

const otpVerificationHandler = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      throw new ExpressError(400, "Email and OTP are required.");
    }

    email = email.toLowerCase().trim();
    otp = otp.toString().trim(); 

    if (!otpStore.isValid(email)) {
      throw new ExpressError(400, "OTP is invalid or expired.");
    }

    const otpData = otpStore.get(email);

 
    if (otp !== otpData.otp.toString()) {
      throw new ExpressError(400, "Incorrect OTP.");
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ExpressError(409, "User already exists.");
    }

    const newUser = new User({
      ...otpData.userData,
      isEmailVerified: true,
    });

    
    const qrUrl = await generateAndUploadQRCode({
      userId: newUser._id,
      email: newUser.email,
      type: "identity",
    });

    newUser.qrUrl = qrUrl;
    await newUser.save();

    
    const accessToken = await generateToken(newUser._id, "7d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    otpStore.delete(email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      role: newUser.role,
    });

  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "OTP verification failed",
    });
  }
};

module.exports = otpVerificationHandler;
