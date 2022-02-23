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

  sequelizeVariableDeclarator.forEach((obj) => {
    console.log(obj);
  });

  const sequelizeVariableDeclaratorName =
    // find the Identifiers
    // get the Node in the NodePath and grab its "name"
    sequelizeImportDeclaration
      .find(j.Identifier)
      // get the first NodePath from the Collection
      .get(0).node.name;

  console.log(sequelizeVariableDeclarator.find(j.ObjectExpression));

  console.log(sequelizeVariableDeclaratorName, sequelizeVariableDeclarator);

  const importedSequelizeVariableName =
    // find the Identifiers
    // get the Node in the NodePath and grab its "name"
    sequelizeImportDeclaration
      .find(j.Identifier)
      // get the first NodePath from the Collection
      .get(0).node.name;

  const operatorsAliasesProperty = sequelizeImportDeclaration.find(
    j.NewExpression,
    {
      callee: { type: 'Identifier', name: importedSequelizeVariableName },
    }
  );

  console.log(operatorsAliasesProperty);

  return root.toSource();
};
