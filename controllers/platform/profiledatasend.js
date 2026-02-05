const ExpressError = require("../../utils/error/expresserror.js");
const User = require("../../models/userModel.js");

const profiledatasender=async (req, res)=>{
  try {
    const user = req.user;
    console.log("Fetched user profile:", user);
    if (!user) {
      throw new ExpressError(404, "User not found");
    }

    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
      qrUrl: user.qrUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };


    if (user.role === "worker") {
      responseData.skills = user.skills;
      responseData.dailyRate = user.dailyRate;
      responseData.portfolio = user.portfolio;
      responseData.isAvailable = user.isAvailable;
      responseData.location = user.location;
    }
    return res.status(200).json(responseData);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to fetch profile",
    });
  }
};

module.exports = profiledatasender;
