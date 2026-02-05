const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");

const createOrder = require("../../controllers/platform/createPayment");
const capturePayment = require("../../controllers/platform/capturePayment");

router.post("/payment/create", auth, createOrder);
router.post("/payment/capture", auth, capturePayment);

module.exports = router;
