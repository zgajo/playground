const db = require("./models");

db["User"].findAndCountAll();
db.User.findAndCountAll();
db.User.findAndCountAll().then();

db.Sequelize.Op;
db.Sequelize.Op;

const updateAttributes = db["User"].update;
const findById = db.User.findByPk;

const passedSequelize = (sequelize) => {
  sequelize.models.User.findAndCountAll();
};
