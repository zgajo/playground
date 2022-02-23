const j = require('jscodeshift');

export default (fileInfo, api) => {
  // const j = api.jscodeshift; // this line is not needed if we use imported j
  const root = j(fileInfo.source);

  const sequelizeImportDeclaration = root.find(j.VariableDeclaration, {
    declarations: [
      {
        type: 'VariableDeclarator',
        init: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: 'sequelize5' }],
        },
      },
    ],
  });

  const sequelizeVariableDeclarator = root.find(j.VariableDeclarator, {
    init: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'require' },
      arguments: [{ type: 'Literal', value: 'sequelize5' }],
    },
  });

  const sequelizeVariableCallExpression = root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'require' },
    arguments: [{ type: 'Literal', value: 'sequelize5' }],
  });

  const sequelizeVariableDeclaratorName =
    // find the Identifiers
    // get the Node in the NodePath and grab its "name"
    sequelizeVariableDeclarator
      .find(j.Identifier)
      // get the first NodePath from the Collection
      .get(0).node.name;

  const importedSequelizeVariableName =
    // find the Identifiers
    // get the Node in the NodePath and grab its "name"
    sequelizeImportDeclaration
      .find(j.Identifier)
      // get the first NodePath from the Collection
      .get(0).node.name;

  const sequelizeNewExpression = root
    .find(j.NewExpression, {
      callee: { name: sequelizeVariableDeclaratorName },
    })
    .forEach((obj) => {
      // Going through every argument in new Sequelize(bla, bla2, etc...)
      obj.value.arguments.forEach((property) => {
        // Searching only the object in arguments as there are multiple properties.
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
    });


  return root.toSource();
};
