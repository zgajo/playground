const db = require("./models");
const ro = require("./models/readonly");

db.User.findAll().spread((row) => {});
db["User"].findAll().spread((row, status) => {});

ro.User.findAll()
  .spread((row, status, _) => {})
  .then();
ro["User"]
  .findAll()
  .spread((row, status, _) => {})
  .then();

const fun = (sequelize) => {
  let Task = sequelize.define("Task", {});

  Task.myCreate = async function (values, options) {
    return await Task.findOrCreate({
      where: "criteria",
      defaults: "values",
      transaction: "transactionIdent",
    }).spread((row) => {});
  };

  Task.findOrCreate({
    where: "criteria",
    defaults: "values",
    transaction: "transactionIdent",
  })
    .then()
    .spread((row) => {});
};
