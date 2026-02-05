const { hashPassword } = require("../../utils/auth/hashpassword.js");
const ExpressError = require("../../utils/error/expresserror.js");
const User = require("../../models/userModel.js");

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const resetPasswordHandler = async (req, res) => {
  try {
    const { token } = req.params;
    let { newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      throw new ExpressError(401, "All fields are required.");
    }

    if (!passwordRegex.test(newPassword)) {
      throw new ExpressError(
        400,
        "Password must be at least 8 characters long, with a lowercase letter, a number, and a special character."
      );
    }

    if (newPassword !== confirmPassword) {
      throw new ExpressError(400, "Passwords do not match.");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ExpressError(400, "Invalid or expired token.");
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.clearCookie("accessToken");

    return res.status(200).json({
      message:
        "Password reset successfully. Please log in again with new credentials.",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Password reset failed",
    });
  }
};

module.exports = resetPasswordHandler;
