const db = require("./models");

db["User"].findAndCount();
db.User.findAndCount();
db.User.findAndCount().then();

db.Sequelize.Op;
db.sequelize.Op;

const updateAttributes = db["User"].updateAttributes;
const findById = db.User.findById;

const passedSequelize = (sequelize) => {
  sequelize.models.User.findAndCount();
};
