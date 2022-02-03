require("dotenv").config();
const cors = require("cors");
const express = require("express");
const makeToken = require("./token").makeToken;
const { emailTemplate, sendEmail } = require("./mail");
const { isAuthenticated } = require("./auth");

const PORT = process.env.PORT || 4000;
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Login endpoint
app.get("/login", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    res.status(404);
    res.send({
      message: "You didn't enter a valid email address.",
    });
  }
  const token = makeToken(email);
  const mailOptions = {
    from: "You Know",
    html: emailTemplate({
      email,
      link: `http://localhost:${PORT}/account?token=${token}`,
    }),
    subject: "Your Magic Link",
    to: email,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200);
    res.send(`Magic link sent. : http://localhost:8080/account?token=${token}`);
  } catch (error) {
    res.status(404);
    console.log(error);
    res.send("Can't send email.");
  }
});

// Get account information
app.get("/account", (req, res) => {
  isAuthenticated(req, res);
});

// Start up the server on the port defined in the environment
const server = app.listen(PORT, () => {
  console.info("Server running on port " + PORT);
});

module.exports = server;
