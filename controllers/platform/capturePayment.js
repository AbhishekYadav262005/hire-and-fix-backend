const paypalClient = require("../../utils/paypal");
const Booking = require("../../models/bookingModel");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const booking = await Booking.findOne({ paymentId: orderId });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "Booking already paid" });
    }

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture=await paypalClient.execute(request);

    booking.paymentStatus = "paid";
    await booking.save();

    res.json({ message: "Payment successful", capture: capture.result  });

  } catch (err) {
    booking.paymentStatus = "failed";
    await booking.save();
    console.error(err);
    res.status(500).json({ error: "Payment capture failed" });
  }
};

module.exports = capturePayment;
