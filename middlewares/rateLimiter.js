const rateLimiter = require("express-rate-limit");

const signupLimiter = rateLimiter({
  max: 3,
  windowMS: 10000,
  message: "Trop de comptes créés pour le moment",
  standardHeaders: false,
  legacyHeaders: false,
});

const loginLimiter = rateLimiter({
  max: 3,
  windowMS: 10000,
  message: "Cherche ton mot de passe et reviens plus tard",
  standardHeaders: false,
  legacyHeaders: false,
});

const RequestLimiter = rateLimiter({
  max: 5,
  windowMS: 5000,
  message: "Prend une pause, reviens plus tard",
  standardHeaders: false,
	legacyHeaders: false,
});

module.exports = {signupLimiter,loginLimiter,RequestLimiter}
