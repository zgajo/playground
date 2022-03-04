const j = require('jscodeshift');
const { isModelsRequireImport } = require('./ast');
const { SEQUELIZE_CAPITALIZED } = require('./constants');

// Model - Removed aliases https://sequelize.org/v5/manual/upgrade-to-v5.html
const changeDeprecatedModelMethods = (methodName) => {
  switch (methodName) {
    case 'insertOrUpdate':
      return 'upsert';

    case 'find':
      return 'findOne';

    case 'findAndCount':
      return 'findAndCountAll';

    case 'findOrInitialize':
      return 'findOrBuild';

    case 'updateAttributes':
      return 'update';

    case 'findById' || 'findByPrimary':
      return 'findByPk';

    case 'all':
      return 'findAll';

    case 'hook':
      return 'addHook';

    default:
      return methodName;
  }
};

module.exports = {
  changeDeprecatedModelMethods,
  /**
   *
   * @param {*} node
   * @returns Checking for models db.SomeModel.find
   */
  changeModelPropertyName: (node) => {
    if (node.value.property.name) {
      node.value.property.name = changeDeprecatedModelMethods(
        node.value.property.name
      );

      return true;
    }
  },
  /**
   *
   * @param {*} node
   * @returns Checking for models db.SomeModel["find"]
   */
  changeModelPropertyValue: (node) => {
    if (node.value.property.value) {
      node.value.property.value = changeDeprecatedModelMethods(
        node.value.property.value
      );

      return true;
    }
  },
  /**
   *
   * @param {*} node
   * Check for the const { findAndCount } =   db["SomeModel"] or db.SomeModel
   */
  changeDestructuredModelKey: (node) => {
    if (
      node.value.init.property.name !== SEQUELIZE_CAPITALIZED &&
      (!!node.value.init.property.name || !!node.value.init.property.value)
    ) {
      // Go through every destructured property and check if the Model method has been deprecated
      node.value.id.properties.forEach((prop) => {
        prop.key.name = changeDeprecatedModelMethods(prop.key.name);
      });

      return true;
    }
  },
  modelsImportFile: (root) => {
    root.find(j.VariableDeclarator, isModelsRequireImport).forEach((node) => {
      // Changing directly used deprecated Model methods and sequelize instance
      solveEveryDirectModelsUsage(root, node.value.id.name);
      // Solves Destructured variables const { Op } = db.sequelize
      solveDestructureObject(root, node.value.id.name);
    });
  },
};
