const express = require("express");
const router = express.Router();

const {
  requestBooking,
  acceptBooking
} = require("../../controllers/platform/bookingRequest");
const getWorkerBookings= require("../../controllers/platform/getWorkerBookings");
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles=require("../../middlewares/rolemiddleware");
const { requireWorkerProfileComplete } = require("../../middlewares/profileComplete");

router.post("/",authMiddleware, authorizeRoles("user"),requireWorkerProfileComplete, requestBooking);
router.put("/respond",authMiddleware, authorizeRoles("worker"), requireWorkerProfileComplete, acceptBooking);
router.get("/worker", authMiddleware,authorizeRoles("worker"), getWorkerBookings);
module.exports = router;
