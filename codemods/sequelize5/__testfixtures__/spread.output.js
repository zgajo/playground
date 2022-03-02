const db = require("./models");
const ro = require("./models/readonly");

db.User.findAll().then(([row]) => {});
db["User"].findAll().then(([row, status]) => {});

ro.User.findAll()
  .then(([row, status, _]) => {})
  .then();
ro["User"]
  .findAll()
  .then(([row, status, _]) => {})
  .then();

const fun = (sequelize) => {
  let Task = sequelize.define("Task", {});

  Task.myCreate = async function (values, options) {
    return await Task.findOrCreate({
      where: "criteria",
      defaults: "values",
      transaction: "transactionIdent",
    }).then(([row]) => {});
  };

  Task.findOrCreate({
    where: "criteria",
    defaults: "values",
    transaction: "transactionIdent",
  })
    .then()
    .then(([row]) => {});
};
