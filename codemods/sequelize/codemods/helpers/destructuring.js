const j = require('jscodeshift');
const { preparedDestructureObjectUsageSearch } = require('./ast');
const {
  deprecatedSequelizeAliases,
  SEQUELIZE_CAPITALIZED,
  SEQUELIZE_LOWER_CASE,
} = require('./constants');
const {
  changeDeprecatedModelMethods,
  changeDestructuredModelKey,
} = require('./model');
const {
  changeSequelizeDestructuringPropertyName,
  changeSequelizeDestructuringPropertyValue,
} = require('./sequelize');

/**
 *
 * @param {*} node
 * Controller for different kind of destructuring
 *
 * Checks for model:
 *
 * const { findAndCount } =   db["SomeModel"] or db.SomeModel
 *
 * Checks for sequelize:
 *
 * const { Op } =   db["sequelize"] or db.sequelize
 *
 * and replaces the imported key for model, or capitalizes "Sequelize" for sequelize
 */
module.exports.destructuringHelper = (node) => {
  // Check for the db.sequelize or  db["sequelize"]
  if (changeSequelizeDestructuringPropertyName(node)) return;
  else if (changeSequelizeDestructuringPropertyValue(node)) return;
  // Check for the db.someModel or  db["someModel"]
  else if (changeDestructuredModelKey(node)) return;
};

module.exports.solveDestructureObject = (root, name) =>
  root
    // Fetch all variables that are created with destructuring const { Op }  = ...
    .find(j.VariableDeclarator, preparedDestructureObjectUsageSearch(name))
    .forEach(this.destructuringHelper);
