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
  message: "Trop de tentatives de connexion",
  standardHeaders: false,
  legacyHeaders: false,
});

const RequestLimiter = rateLimiter({
  max: 50,
  windowMS: 5000,
  message: "Trop de requêtes envoyées pour le moment",
  standardHeaders: false,
  legacyHeaders: false,
});

module.exports = { signupLimiter, loginLimiter, RequestLimiter };
