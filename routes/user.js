const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { signupLimiter, loginLimiter } = require("../middlewares/rateLimiter");

router.post("/signup", signupLimiter, userCtrl.signup);
router.post("/login", loginLimiter, userCtrl.login);

module.exports = router;
