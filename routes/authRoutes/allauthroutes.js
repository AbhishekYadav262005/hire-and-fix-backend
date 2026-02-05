const express = require("express");
const router = express.Router();

const loginHandler = require("../../controllers/auth/loginhandler");
const resendOtpHandler = require("../../controllers/auth/resendotphandler");
const forgetpasswordHandler = require("../../controllers/auth/forgetpasshandler");
const resetPasswordHandler = require("../../controllers/auth/resetPassHandler.js");
const signupHandler = require("../../controllers/auth/signuphandler");
const verifyOtpHandler = require("../../controllers/auth/verify-otp");


const otpRateLimiter = require("./otplimiter"); 

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/forget-password", forgetpasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);
router.post("/verify-otp", verifyOtpHandler);

router.post("/resend-otp", otpRateLimiter, resendOtpHandler);

module.exports = router;
