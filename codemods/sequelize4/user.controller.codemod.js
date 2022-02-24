const j = require('jscodeshift');
const {
  deprecatedSequelizeAliases,
  SEQUELIZE_CAPITALIZED,
  SEQUELIZE_LOWER_CASE,
} = require('./codemods/helpers/constants');
const { destructuringHelper } = require('./codemods/helpers/destructuring');
const { changeDeprecatedModelMethods } = require('./codemods/helpers/model');

/**
 * TODO: Should we add hooks deprecated changes?
 * TODO: There are some use cases that needs to be covered:
    
    const sequelize = db.sequelize
    const kk = sequelize.Op

    const { Op } = db.sequelize

    This is also for the 
    const User = db["User"]
    const { findOne } = db["User"]

 */

module.exports = (fileInfo, api) => {
  // const j = api.jscodeshift; // this line is not needed if we use imported j
  const root = j(fileInfo.source);

  const foundImports = {};

  root
    .find(j.VariableDeclarator, {
      init: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'require' },
      },
    })
    .forEach((node) => {
      if (
        (node.value.init.arguments[0].value &&
          node.value.init.arguments[0].value.endsWith('/models')) ||
        node.value.init.arguments[0].value.endsWith('/models/index') ||
        node.value.init.arguments[0].value.endsWith('/models/readonly') ||
        node.value.init.arguments[0].value.endsWith('/models/readonly-exports')
      ) {
        foundImports[node.value.id.name] = node;
      }
    });

  for (const key in foundImports) {
    // Changing deprecated Model methods
    root
      .find(j.MemberExpression, {
        object: {
          type: 'MemberExpression',
          object: {
            name: key,
          },
        },
      })
      .forEach((node) => {
        node.value.property.name = changeDeprecatedModelMethods(
          node.value.property.name
        );
      });

    // Changing deprecated Sequelize aliases
    root
      .find(j.MemberExpression, {
        object: {
          type: 'MemberExpression',
          object: {
            name: key,
          },
          property: {
            name: SEQUELIZE_LOWER_CASE,
          },
        },
      })
      .forEach((node) => {
        if (deprecatedSequelizeAliases.includes(node.value.property.name)) {
          node.value.object.property.name = SEQUELIZE_CAPITALIZED;
        }
      });

    destructuringHelper(root, key);
  }

  return root.toSource();
};
