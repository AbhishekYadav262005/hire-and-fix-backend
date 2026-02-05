const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");
const searchWorkers = require("../../controllers/platform/searchWorker");
const authorizeRoles=require("../../middlewares/rolemiddleware");

router.get("/search", authMiddleware,authorizeRoles("user"), searchWorkers);

module.exports = router;
