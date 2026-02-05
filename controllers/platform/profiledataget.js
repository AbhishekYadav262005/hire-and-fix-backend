const ExpressError = require("../../utils/error/expresserror.js");
const User = require("../../models/userModel.js");

const roleUpdateFields = {
  user: ["username", "phone", "address", "avatarUrl"],
  worker: [
    "username",
    "phone",
    "address",
    "avatarUrl",
    "skills",
    "bio",
    "experience",
    "portfolio",
    "dailyRate",
    "location",
  ],
};

const profiledatagetter = async (req, res) => {
  try {
    console.log("Profile data update request received");

    const user = req.user;
    if (!user) throw new ExpressError(401, "User not authenticated");

    const body = req.body || {};
    const allowedFields = roleUpdateFields[user.role] || [];

    const updates = {};

    for (const key of allowedFields) {
      if (key !== "location" && body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (
      user.role === "worker" &&
      body.location?.coordinates &&
      Array.isArray(body.location.coordinates)
    ) {
      updates.location = {
        type: "Point",
        coordinates: body.location.coordinates,
      };
    }

    if (Object.keys(updates).length === 0) {
      throw new ExpressError(400, "No valid data provided for update");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

      if (user.role === "worker") {
      updatedUser.isProfileComplete =
        updatedUser.dailyRate > 0 &&
        updatedUser.skills &&
        updatedUser.skills.length > 0;
      await updatedUser.save();
    }


    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to update profile",
    });
  }
};

module.exports = profiledatagetter;
