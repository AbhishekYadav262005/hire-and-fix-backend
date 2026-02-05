const { generateOTP, sendOTPEmail } = require("../../utils/auth/emailvalidateotp.js");
const ExpressError = require("../../utils/error/expresserror.js");
const User = require("../../models/userModel.js");
const otpStore = require("../../utils/auth/otpstore.js");

const resendOtpHandler = async (req, res) => {
  try {
    let { email } = req.body;
    
    if (!email || typeof email !== "string") {
      throw new ExpressError(400, "Valid email is required.");
    }

    email = email.toLowerCase();

    const otpData = otpStore.get(email);
    if (!otpData || !otpData.userData) {
      throw new ExpressError(
        400,
        "Signup session expired. Please sign up again."
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      otpStore.delete(email);
      throw new ExpressError(
        409,
        "User already registered. Please log in."
      );
    }

  
    const newOtp = generateOTP();
    otpData.otp = newOtp;
    otpData.expiresAt = Date.now() + 5 * 60 * 1000; 
    otpStore.set(email, otpData);

    await sendOTPEmail(email, newOtp);

    return res.status(200).json({
      message: "OTP resent successfully.",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to resend OTP",
    });
  }
};

module.exports = resendOtpHandler;
