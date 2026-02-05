const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["booking_request", "booking_update", "review"], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  meta: { type: Object }, 
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
