const validator = require("validator");

module.exports = (req, res, next) => {
  const email = req.body.email;
  const isEmail = validator.isEmail(email);
  if (!isEmail)
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  next();
};
