const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes= require("./routes/book");
const config = require("./config")
const path = require ("path")


mongoose
  .connect(
    `mongodb+srv://${config.db.user}:${config.db.password}@cluster0.kbbytib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true }
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
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use("/api/auth", userRoutes);
app.use("/api/books",bookRoutes)



module.exports = app;
