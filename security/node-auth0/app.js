require("dotenv").config();
const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");

const app = express();
const PORT = process.env.PORT || 3001;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `http://localhost:${PORT}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// requiresAuth checks authentication.
app.get("/admin", requiresAuth(), (req, res) =>
  res.send(
    `Hello ${JSON.stringify(
      req.oidc.idTokenClaims
    )}, this is the admin section.`
  )
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
