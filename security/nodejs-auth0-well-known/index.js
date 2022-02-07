require("dotenv").config();
var express = require("express");
var app = express();
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
var cors = require("cors");

var port = process.env.PORT || 4000;

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUDIENCE,
  issuer: `https://${process.env.DOMAIN}/`,
  algorithms: ["RS256"],
});

app.use(cors({ origin: "*" }));
app.use(jwtCheck);

app.get("/authorized", function (req, res) {
  res.send("Hello from backend Secured Resource");
});

app.listen(port, () => {
  console.log("listening on port:", port);
});
