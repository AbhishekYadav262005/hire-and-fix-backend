const paypalClient = require("../../utils/paypal");
const Booking = require("../../models/bookingModel");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

const createOrder=async(req,res)=>{
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking || booking.status !== "accepted") {
      return res.status(400).json({ error: "Booking not payable" });
    }
    if(booking.paymentStatus === "paid") {
        return res.status(400).json({ error: "Booking already paid" });
      }

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: booking.totalCost.toString()
          }
        }
      ]
    });

    const order = await paypalClient.execute(request);

    booking.paymentId = order.result.id;
    await booking.save();

    res.json({
      orderId: order.result.id,
      approveLink: order.result.links.find(
        (l) => l.rel === "approve"
      ).href
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment order failed" });
  }
};

module.exports = createOrder;
