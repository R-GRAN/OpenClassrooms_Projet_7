require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const path = require("path");
const {RequestLimiter} = require("./middlewares/rateLimiter");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAINE}`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

/* headers CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/* Permet de recuperer le JSON (ancien bodyParser) */
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(RequestLimiter);

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
