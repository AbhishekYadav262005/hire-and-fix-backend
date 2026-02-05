const User = require("../../models/userModel");
const ExpressError = require("../../utils/error/expresserror");


const searchWorkers = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      throw new ExpressError(403, "Only users can search for workers");
    }

    const { skills, lat, lng, maxDistance = 5000 } = req.query;

    const query = { role: "worker", isAvailable: true };

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillArray };
    }

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }

    const workers = await User.find(query).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to search workers",
    });
  }
};

module.exports = searchWorkers;
