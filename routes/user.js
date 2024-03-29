const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { signupLimiter, loginLimiter } = require("../middlewares/rateLimiter");
const passwordValidator = require("../middlewares/password-validator");
const validator = require("../middlewares/validator");

router.post(
  "/signup",
  validator,
  passwordValidator,
  signupLimiter,
  userCtrl.signup
);
router.post("/login", validator, loginLimiter, userCtrl.login);

module.exports = router;
