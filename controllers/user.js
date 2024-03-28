require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hash,
    });

    await user.save();

    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user === null)
      return res
        .status(400)
        .json({ message: "Identifiant ou/et mot de passe incorrect(s)" });

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (isValid === true) {
      res.status(200).json({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
          expiresIn: "24h",
        }),
      });
    } else {
      res.status(400).json({
        message: "Identifiant ou/et mot de passe incorrect(s)",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
