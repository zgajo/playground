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
        if (DEPRECATED_SEQUELIZE_ALIASES.includes(prop.key.name)) {
          node.value.init.property.value = SEQUELIZE_CAPITALIZED;
        }
      });

      return true;
    }
  },
  /**
   *
   * @param {*} value expects to be oneOf '/models', '/models/index', '/models/readonly', '/models/readonly-exports'
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
  /**
   *
   * @param {*} obj fetched Sequelize object tree
   * Going through the arguments and searching object, change operatorsAliases to number
   */
  changeSequelizeCreationOperatorsAliasesProperty: (obj) => {
    // Going through every argument in new Sequelize(bla, bla2, etc...)
    obj.value.arguments.forEach((property) => {
      // Searching only the object in arguments as there are multiple parameters.
      if (property.type !== 'ObjectExpression') return;

      property.properties.forEach((property2) => {
        // SOLUTION FOR: DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed
        if (property2.type !== 'Property') return;
        if (property2.key.name !== 'operatorsAliases') return;

        if (property2.value.value === true) {
          property2.value.value = 1;
        } else if (property2.value.value === false) {
          property2.value.value = 0;
        }
      });
    });
  },
};
