const express = require("express");
const router = express.Router();
const { redirectUrl } = require("../controller/urlcontroller");

router.get("/:code", redirectUrl);

module.exports = router;
