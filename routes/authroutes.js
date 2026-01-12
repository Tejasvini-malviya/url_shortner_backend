const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller");

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);

module.exports = router;