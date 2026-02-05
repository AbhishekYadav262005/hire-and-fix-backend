const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getNotifications, markAsRead } = require("../../controllers/platform/notificationHandler");

router.get("/", authMiddleware, getNotifications);
router.put("/:notificationId/read", authMiddleware, markAsRead);

module.exports = router;
