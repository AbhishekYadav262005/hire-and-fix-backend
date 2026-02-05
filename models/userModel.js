const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, 
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    qrUrl: String,
    phone: String,
    address: String,
    avatarUrl: String,

    role: {
      type: String,
      enum: ["user", "worker"],
      default: "user",
    },

    skills: {
      type: [String],
      index: true, 
    },

    dailyRate: {
      type: Number,
      min: 0,
    },

    portfolio: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: true,
        default: [0, 0],
      },
    },

    notifications: [
      {
        type: { type: String },
        message: String,
        read: { type: Boolean, default: false },
        data: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
