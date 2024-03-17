const express = require('express');

const app = express();

app.use((req, res) => {
   res.json({ message: "hello c'est fait !" }); 
});

module.exports = app;