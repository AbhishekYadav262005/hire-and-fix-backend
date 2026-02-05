const Booking = require("../../models/bookingModel");
const User = require("../../models/userModel");
const ExpressError = require("../../utils/error/expresserror");

const getWorkerBookings = async (req, res) => {
  try {
    const workerId = req.user.id;

    const { status } = req.query; 

    let filter = { worker: workerId };

    if (status) {
      filter.status = status.toLowerCase();
    }

    const bookings = await Booking.find(filter)
      .populate("user", "username email phone avatarUrl");

    let groupedBookings = bookings;
    if (!status) {
      groupedBookings = {
        pending: bookings.filter(b => b.status === "pending"),
        accepted: bookings.filter(b => b.status === "accepted"),
        rejected: bookings.filter(b => b.status === "rejected"),
      };
    }

    res.status(200).json({
      success: true,
      message: "Worker bookings fetched successfully",
      count: bookings.length,
      bookings: groupedBookings,
    });
  } catch (err) {
    console.error("Error fetching worker bookings:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch worker bookings",
    });
  }
};

module.exports = getWorkerBookings;
