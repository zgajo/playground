const db = require("./models");
const ro = require("./models/readonly");

db.User.findAll().then(([row]) => {});
db["User"].findAll().then(([row, status]) => {});

ro.User.findAll()
  .then(([row, status, _]) => {})
  .then();
ro["User"].findAll().then().then();
