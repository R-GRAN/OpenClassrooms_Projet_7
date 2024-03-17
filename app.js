const express = require('express');
const mongoose = require("mongoose")


mongoose.connect('mongodb+srv://openClassrooms:openClassrooms@cluster0.kbbytib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res) => {
   res.json({ message: "hello c'est fait !" }); 
});

module.exports = app;