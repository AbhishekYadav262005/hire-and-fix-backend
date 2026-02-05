const generatetoken = require("../../utils/token/generatewebtoken.js");
const { hashPassword } = require("../../utils/auth/hashpassword.js");
const ExpressError = require("../../utils/error/expresserror.js");
const nodemailer = require("nodemailer");
const User = require("../../models/userModel.js");

const forgetHandler = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      throw new ExpressError(401, "Field is required");
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      throw new ExpressError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      throw new ExpressError(
        400,
        "Please verify your email to reset password!"
      );
    }

    const resetToken = await generatetoken(user._id, "15m");

    const hashedToken = await hashPassword(resetToken);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>Click 
          <a href="http://localhost:8080/reset-password/${resetToken}">
            here
          </a> 
        to reset your password.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Reset link sent to email",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to send reset email",
    });
  }
};

module.exports = forgetHandler;
