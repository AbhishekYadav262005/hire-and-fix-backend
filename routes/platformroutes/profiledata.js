const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");

const updateProfile = require("../../controllers/platform/profiledataget");
const getProfile = require("../../controllers/platform/profiledatasend");


router.put("/", authMiddleware, updateProfile);

router.get("/", authMiddleware, getProfile);

module.exports = router;
