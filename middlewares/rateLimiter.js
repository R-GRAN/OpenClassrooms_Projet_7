const rateLimiter = require("express-rate-limit");

const signupLimiter = rateLimiter({
  max: 3,
  windowMS: 10000,
  message: "Too many accounts created for the moment",
  standardHeaders: false,
  legacyHeaders: false,
});

const loginLimiter = rateLimiter({
  max: 3,
  windowMS: 10000,
  message: "Too many login attempts",
  standardHeaders: false,
  legacyHeaders: false,
});

const RequestLimiter = rateLimiter({
  max: 50,
  windowMS: 5000,
  message: "Too many requests sent for the moment",
  standardHeaders: false,
  legacyHeaders: false,
});

module.exports = { signupLimiter, loginLimiter, RequestLimiter };
