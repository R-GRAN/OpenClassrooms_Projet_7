const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, config.jwt.key);
  const userId = decodedToken.userId;
  req.auth = { userId: userId };
  next().catch((error) => res.status(401).json({ error }));
};
