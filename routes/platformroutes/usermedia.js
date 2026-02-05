const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 

const authMiddleware = require("../../middlewares/authMiddleware");
const { uploadAvatar, uploadPortfolio } = require("../../controllers/platform/uploadmedia");
const getPortfolio = require("../../controllers/platform/getportfolio");

router.put(
  "/avatar",
  authMiddleware,
  upload.single("avatar"), 
  uploadAvatar
);


router.put(
  "/portfolio",
  authMiddleware,
  upload.array("portfolio", 10), 
  uploadPortfolio
);
router.get("/:userId", authMiddleware, getPortfolio);

module.exports = router;
