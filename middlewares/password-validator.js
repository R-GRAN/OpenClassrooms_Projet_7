const validator = require("password-validator");
const schema = new validator();

schema
  .is()
  .min(6) // Minimum length 6
  .is()
  .not()
  .oneOf(["azerty", "123456"]);

module.exports = (req, res, next) => {
  const password = req.body.password;

  const verif = schema.validate(password, { details: true });
  if (verif.length != 0) {
    return res.status(400).json({ message: verif });
  }
  next();
};
