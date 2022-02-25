const {
  changeModelPropertyName,
  changeModelPropertyValue,
} = require('./model');
const {
  changeSequelizePropertyName,
  changeSequelizePropertyValue,
} = require('./sequelize');

/**
 *
 * @param {*} node
 * Controller for different kind of destructuring
 *
 * Checks for model:
 *
 * db["SomeModel"].find or db.SomeModel.find
 *
 * Checks for sequelize:
 *
 * db["sequelize"].Op or db.sequelize.Op
 *
 * and replaces the used method for model, or capitalizes "Sequelize" for sequelize
 */
module.exports.directMethodUsageHelper = (node) => {
  // Changing deprecated Sequelize aliases db.sequelize.Op
  if (changeSequelizePropertyName(node)) return;
  // Changing deprecated Sequelize aliases db.sequelize["Op"]
  else if (changeSequelizePropertyValue(node)) return;
  // Checking for models db.SomeModel.find
  else if (changeModelPropertyName(node)) return;
  // Checking for models db.SomeModel["find"]
  else if (changeModelPropertyValue(node)) return;
};
