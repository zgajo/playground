const j = require('jscodeshift');
const {
  deprecatedSequelizeAliases,
  SEQUELIZE_CAPITALIZED,
  SEQUELIZE_LOWER_CASE,
} = require('./constants');
const { changeDeprecatedModelMethods } = require('./model');

/**
 *  Used for transforming different kind of destrucutres of the imported module
 * @param {*} root Root of AST, complete structure
 * @param {*} importedModelsName name of the imported models module
 */
module.exports.destructuringHelper = (root, importedModelsName) => {
  // Solves const { Op } = db.sequelize
  root
    // Fetch all variables that are created with destructuring const { Op }  = ...
    .find(j.VariableDeclarator, {
      id: {
        type: 'ObjectPattern',
      },
      init: {
        object: { name: importedModelsName },
      },
    })
    .forEach((node) => {
      // Check for the db.sequelize or  db["sequelize"]
      if (
        node.value.init.property.name === SEQUELIZE_LOWER_CASE ||
        node.value.init.property.value === SEQUELIZE_LOWER_CASE
      ) {
        // Go through every destructured property and check if the sequelize alias has changed
        node.value.id.properties.forEach((prop) => {
          if (deprecatedSequelizeAliases.includes(prop.key.name)) {
            node.value.init.property.name = SEQUELIZE_CAPITALIZED;
          }
        });
      }
      // Check for the db.someModel or  db["someModel"]
      else if (
        node.value.init.property.name !== SEQUELIZE_CAPITALIZED &&
        (!!node.value.init.property.name || !!node.value.init.property.value)
      ) {
        // Go through every destructured property and check if the Model method has been deprecated
        node.value.id.properties.forEach((prop) => {
          prop.key.name = changeDeprecatedModelMethods(prop.key.name);
        });
      }
    });
};
