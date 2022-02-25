const {
  DEPRECATED_SEQUELIZE_ALIASES,
  SEQUELIZE_CAPITALIZED,
  SEQUELIZE_LOWER_CASE,
} = require('./constants');

module.exports = {
  /**
   *
   * @param {*} node
   * @returns Checking for models db.sequelize.Op
   */
  changeSequelizePropertyName: (node) => {
    if (DEPRECATED_SEQUELIZE_ALIASES.includes(node.value.property.name)) {
      node.value.object.property.name = SEQUELIZE_CAPITALIZED;
      return true;
    }
  },
  /**
   *
   * @param {*} node
   * @returns Checking for models db.sequelize["Op"]
   */
  changeSequelizePropertyValue: (node) => {
    if (DEPRECATED_SEQUELIZE_ALIASES.includes(node.value.property.value)) {
      node.value.object.property.value = SEQUELIZE_CAPITALIZED;
      return true;
    }
  },
  /**
   *
   * @param {*} node
   * Check for the const { Op } =  db.sequelize
   */
  changeSequelizeDestructuringPropertyName: (node) => {
    if (node.value.init.property.name === SEQUELIZE_LOWER_CASE) {
      // Go through every destructured property and check if the sequelize alias has changed
      node.value.id.properties.forEach((prop) => {
        if (DEPRECATED_SEQUELIZE_ALIASES.includes(prop.key.name)) {
          node.value.init.property.name = SEQUELIZE_CAPITALIZED;
        }
      });

      return true;
    }
  },
  /**
   *
   * @param {*} node
   * Check for the const { Op } =   db["sequelize"]
   */
  changeSequelizeDestructuringPropertyValue: (node) => {
    if (node.value.init.property.value === SEQUELIZE_LOWER_CASE) {
      // Go through every destructured property and check if the sequelize alias has changed
      node.value.id.properties.forEach((prop) => {
        if (DEPRECATED_SEQUELIZE_ALIASES.includes(prop.key.value)) {
          node.value.init.property.value = SEQUELIZE_CAPITALIZED;
        }
      });

      return true;
    }
  },
  /**
   *
   * @param {*} value
   * @returns boolean value of the import check
   */
  isDbImport: (value) => {
    return (
      (value && value.endsWith('/models')) ||
      value.endsWith('/models/index') ||
      value.endsWith('/models/readonly') ||
      value.endsWith('/models/readonly-exports')
    );
  },
};
