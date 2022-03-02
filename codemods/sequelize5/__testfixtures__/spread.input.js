const db = require("./models");
const ro = require("./models/readonly");

db.User.findAll().spread((row) => {});
db["User"].findAll().spread((row, status) => {});

ro.User.findAll()
  .spread((row, status, _) => {})
  .then();
ro["User"].findAll().spread().then();
