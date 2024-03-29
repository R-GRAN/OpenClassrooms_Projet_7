require('dotenv').config()
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        return res
          .status(400)
          .json({ message: "Identifiant ou/et mot de passe incorrect(s)" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (valid === true) {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({userId: user._id},process.env.JWT_KEY,{expiresIn:"24h"}),
              });
            } else {
              return res.status(400).json({
                message: "Identifiant ou/et mot de passe incorrect(s)",
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
