const Booking = require("../../models/bookingModel");
const User = require("../../models/userModel");

const requestBooking = async (req, res) => {
  try {
    const {
      workerId,
      startDate,
      endDate,
      workAddress,
      location,
      workDetails
    } = req.body;

    const userId = req.user.id;

    if (!workerId || !startDate || !endDate || !workDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ error: "Worker not found" });
    }

    const hasSkill = worker.skills
      .map(skill => skill.toLowerCase())
      .includes(workDetails.toLowerCase());

    if (!hasSkill) {
      return res.status(400).json({
        error: "Worker does not provide this service"
      });
    }

    if (!worker.dailyRate || worker.dailyRate <= 0) {
      return res.status(400).json({
        error: "Worker has not set a valid daily rate yet"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        error: "End date must be after start date"
      });
    }

    const conflict = await Booking.findOne({
      worker: workerId,
      status: "accepted",
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (conflict) {
      return res.status(409).json({
        error: "Worker not available for selected dates"
      });
    }

    const durationDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const totalCost = durationDays * worker.dailyRate;

    const booking = await Booking.create({
      user: userId,
      worker: workerId,
      workDetails,
      workAddress,
      location,
      startDate: start,
      endDate: end,
      totalCost,
      status: "pending"
    });

    worker.notifications.push({
      type: "booking_request",
      message: `New booking request for ${workDetails} (${durationDays} days).`,
      data: { bookingId: booking._id, userId }
    });

    await worker.save();

    res.status(201).json({
      message: "Booking requested successfully",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request booking" });
  }
};


const acceptBooking = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { bookingId, accept } = req.body;

    if (!bookingId || typeof accept !== "boolean") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.worker.toString() !== workerId) {
      return res.status(403).json({
        error: "You are not authorized to respond to this booking"
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        error: "Booking already responded to"
      });
    }

    if (booking.totalCost <= 0) {
      return res.status(400).json({
        error: "Cannot process booking with invalid total cost"
      });
    }

    if (accept) {
      const worker = await User.findById(workerId);

      if (!worker || worker.role !== "worker") {
        return res.status(403).json({ error: "Invalid worker account" });
      }

      const hasSkill = worker.skills
        .map(skill => skill.toLowerCase())
        .includes(booking.workDetails.toLowerCase());

      if (!hasSkill) {
        return res.status(400).json({
          error: "You no longer have the required skill for this booking"
        });
      }
    }

    booking.status = accept ? "accepted" : "rejected";
    booking.respondedAt = new Date();
    if (accept) booking.acceptedAt = new Date();

    await booking.save();

    const user = await User.findById(booking.user);
    if (user) {
      user.notifications.push({
        type: accept ? "booking_accepted" : "booking_rejected",
        message: `Your booking for ${booking.workDetails} has been ${accept ? "accepted" : "rejected"}.`,
        data: { bookingId, workerId }
      });
      await user.save();
    }

    res.status(200).json({
      message: `Booking ${accept ? "accepted" : "rejected"} successfully`,
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};


module.exports = { requestBooking, acceptBooking };
