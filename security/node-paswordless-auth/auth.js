const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.status(403);
    res.send("Can't verify user.");
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    res.status(403);
    res.send("Invalid auth credentials.");
    return;
  }
  if (
    !decoded.hasOwnProperty("email") ||
    !decoded.hasOwnProperty("expirationDate")
  ) {
    res.status(403);
    res.send("Invalid auth credentials.");
    return;
  }
  const { expirationDate } = decoded;
  if (expirationDate < new Date()) {
    res.status(403);
    res.send("Token has expired.");
    return;
  }
  res.status(200);
  res.send("User has been validated.");
};

module.exports = {
  isAuthenticated,
};
