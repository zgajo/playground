const j = require('jscodeshift');

const {
  DEPRECATED_MODEL_METHODS,
  DEPRECATED_SEQUELIZE_ALIASES,
  SEQUELIZE_CAPITALIZED,
} = require('./constants');
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

/**
 *
 * @param {*} root
 * @param {*} name name of the object that has models property, e.g. sequelize, db will loog for sequelize.models or db.models
 * Searching for the models used and changing deprecated Models methods
 */
module.exports.solveEveryDirectModelsUsage = (root, name) => {
  root
    .find(
      j.MemberExpression,
      (obj) => obj.object.name === name && obj.property.name === 'models'
    )
    .forEach(this.searchForObjectProperties);
};

module.exports.directMethodUsageHelper = directMethodUsageHelper;

module.exports.searchForObjectProperties = (memberPath) => {
  let currentMemberPath = memberPath;

  while (currentMemberPath) {
    // This is a call expression of the method
    if (currentMemberPath.value.type === 'CallExpression') {
      currentMemberPath = currentMemberPath.parent;

      continue;
    }

    // We are done when we are not in the object anymore
    if (currentMemberPath.value.type !== 'MemberExpression') break;

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

/**
 *
 * @param {*} root
 * @param {*} name name of the object that has models property, e.g. sequelize, db will loog for sequelize.models or db.models
 * Searching for the models used and changing deprecated Models methods
 */
module.exports.solveEveryDirectSequlizeUsage = (root, name) => {
  root
    .find(
      j.MemberExpression,
      (obj) =>
        obj.object.name === name &&
        DEPRECATED_SEQUELIZE_ALIASES.includes(obj.property.name)
    )
    .forEach((nodePath) => {
      // Check if const Sequelize = require("sequelize") exists
      const sequelizeUsed = root.find(j.VariableDeclarator, {
        id: {
          name: SEQUELIZE_CAPITALIZED,
        },
        init: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: 'sequelize' }],
        },
      });

      // insert sequelize import to the first line
      if (!sequelizeUsed.length) {
        const sequelizeVariable = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(SEQUELIZE_CAPITALIZED),
            j.callExpression(j.identifier('require'), [j.literal('sequelize')])
          ),
        ]);

        // set the sequelize import to the first line
        root.get().node.program.body.unshift(sequelizeVariable);
      }

      nodePath.node.object.name = SEQUELIZE_CAPITALIZED;
    });
};
