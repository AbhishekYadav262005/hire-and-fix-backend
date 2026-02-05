const Booking = require("../../models/bookingModel.js");
const User = require("../../models/userModel.js");
const ExpressError = require("../../utils/error/expresserror.js");

const submitReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id; 

    if (!rating || rating < 1 || rating > 5) {
      throw new ExpressError(400, "Rating must be between 1 and 5");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) throw new ExpressError(404, "Booking not found");

    if (booking.user.toString() !== userId) {
      throw new ExpressError(403, "You can only review your own bookings");
    }

    if (booking.status !== "completed") {
      throw new ExpressError(400, "Can only review completed bookings");
    }

    booking.rating = rating;
    booking.review = review || "";
    await booking.save();

    res.status(200).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Failed to submit review",
    });
  }
};

const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;

    const bookings = await Booking.find({
      worker: workerId,
      rating: { $exists: true },
    }).select("rating review user createdAt");

    const avgRating =
      bookings.reduce((acc, b) => acc + b.rating, 0) / (bookings.length || 1);

    res.status(200).json({
      totalReviews: bookings.length,
      averageRating: avgRating.toFixed(1),
      reviews: bookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {submitReview,getWorkerReviews};
