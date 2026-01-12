const express = require("express");
const router = express.Router();
const { createShortUrl } = require("../controller/urlcontroller");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/shorten", authMiddleware, createShortUrl);

module.exports = router;
