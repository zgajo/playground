const jwt = require("jsonwebtoken");
// Generate token
const makeToken = (email) => {
  const expirationDate = new Date();
  expirationDate.setHours(new Date().getHours() + 1);
  return jwt.sign({ email, expirationDate }, process.env.JWT_SECRET_KEY);
};

module.exports = {
  makeToken,
};
