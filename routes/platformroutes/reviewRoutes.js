const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const {submitReview,getWorkerReviews} = require("../../controllers/platform/reviewhandler.js");
const authorizedRole=require("../../middlewares/rolemiddleware");

router.post("/booking/:bookingId/review", authMiddleware,authorizedRole("user"), submitReview);


router.get("/worker/:workerId/reviews", getWorkerReviews);

module.exports = router;
