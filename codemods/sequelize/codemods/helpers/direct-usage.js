const {
  DEPRECATED_MODEL_METHODS,
  DEPRECATED_SEQUELIZE_ALIASES,
} = require("./constants");
const {
  changeModelPropertyName,
  changeModelPropertyValue,
} = require("./model");
const {
  changeSequelizePropertyName,
  changeSequelizePropertyValue,
} = require("./sequelize");

/**
 *
 * @param {*} node
 * Changing directly used deprecated Model methods and sequelize instance
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
const directMethodUsageHelper = (node) => {
  // Changing deprecated Sequelize aliases db.sequelize.Op
  if (changeSequelizePropertyName(node)) return;
  // Changing deprecated Sequelize aliases db.sequelize["Op"]
  else if (changeSequelizePropertyValue(node)) return;
  // Checking for models db.SomeModel.find
  else if (changeModelPropertyName(node)) return;
  // Checking for models db.SomeModel["find"]
  else if (changeModelPropertyValue(node)) return;
};

module.exports.directMethodUsageHelper = directMethodUsageHelper;

module.exports.searchForObjectProperties = (memberPath) => {
  let currentMemberPath = memberPath;

  while (currentMemberPath) {
    // This is a call expression of the method
    if (currentMemberPath.value.type === "CallExpression") {
      currentMemberPath = currentMemberPath.parent;

      continue;
    }

    // We are done when we are not in the object anymore
    if (currentMemberPath.value.type !== "MemberExpression") break;

    const propertyName =
      currentMemberPath.value.property.name ||
      currentMemberPath.value.property.value;

    if (
      DEPRECATED_MODEL_METHODS.includes(propertyName) ||
      DEPRECATED_SEQUELIZE_ALIASES.includes(propertyName)
    ) {
      directMethodUsageHelper(currentMemberPath);
    }

    currentMemberPath = currentMemberPath.parent;
  }
};
