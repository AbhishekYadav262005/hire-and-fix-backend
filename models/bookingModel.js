const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    acceptedAt: {
      type: Date
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    totalCost: {
      type: Number,
      required: true
    },

    workAddress: {
      type: String,
      required: true
    },

    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    workDetails: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    paymentId: {
      type: String
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
