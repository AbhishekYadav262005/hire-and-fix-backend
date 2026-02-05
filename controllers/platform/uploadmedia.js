const User = require("../../models/userModel");
const uploadToCloudinary= require("../../utils/qr/cloudinary");

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No avatar file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "avatars");

    user.avatarUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

const uploadPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "worker") {
      return res.status(403).json({ error: "Only workers can upload portfolio" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No portfolio images uploaded" });
    }

    if (user.portfolio.length + req.files.length > 100) {
      return res.status(400).json({ error: "Portfolio limit is 100 images" });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "portfolio");
      uploadedUrls.push(result.secure_url);
    }

    user.portfolio.push(...uploadedUrls);
    await user.save();

    res.status(200).json({
      message: "Portfolio uploaded successfully",
      totalPortfolio: user.portfolio.length,
    });
  } catch (err) {
    console.error("Portfolio upload error:", err);
    res.status(500).json({ error: "Failed to upload portfolio" });
  }
};

module.exports = { uploadAvatar, uploadPortfolio };
