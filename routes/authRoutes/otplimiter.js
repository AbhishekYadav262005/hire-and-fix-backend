const rateLimit = require("express-rate-limit");


const otpLimiter = rateLimit({
  windowMs: 30 * 1000, 
  max: 1,
  message: {
    success: false,
    error: "Too many OTP requests. Please wait 30 seconds.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = otpLimiter;