const j = require('jscodeshift');

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
// Sequelize - Removed aliases https://sequelize.org/v5/manual/upgrade-to-v5.html
// not including - dont know what it does Sequelize.prototype[error]	
const deprecatedSequelizeAliases = ["Utils", "Promise", "TableHints", "Op", "Transaction", "Model", "Deferrable", "Error"]


export default (fileInfo, api) => {
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
        node.value.init.arguments[0].value &&
        node.value.init.arguments[0].value.endsWith('/models') ||
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
            name: "sequelize"
          }
        },
      })
      .forEach((node) => {
        if (deprecatedSequelizeAliases.includes(node.value.property.name)) {
          node.value.object.property.name = "Sequelize"
        }
      });
  }

  return root.toSource();
};
