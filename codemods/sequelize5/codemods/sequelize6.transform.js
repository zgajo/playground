const j = require("jscodeshift");

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  root
    .find(j.CallExpression, (obj) => obj.callee?.property?.name === "spread")
    .replaceWith((nodePath) => {
      const { node } = nodePath;

      node.callee.property.name = "then";

      return node;
    })
    .forEach((astPath) => {
      const { node } = astPath;
      // A function that is passed into a spread function
      const spreadFunction = node.arguments[0];

      if (spreadFunction) {
        if (
          spreadFunction.type === "FunctionExpression" ||
          spreadFunction.type === "ArrowFunctionExpression"
        ) {
          const spreadFunctionParams = spreadFunction.params.map((param) => {
            return j.identifier(param.name);
          });

          const arr = j.arrayPattern(spreadFunctionParams);

          spreadFunction.params = [arr];
        }
      }
    });

  root
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ type: "Literal", value: "sequelize" }],
      },
    })
    .forEach((nodePath) => {
      const { node } = nodePath;
      const sequelizeName = node.id.name;

      root
        // searching new Sequelize()
        .find(j.VariableDeclarator, {
          init: { type: "NewExpression", callee: { name: sequelizeName } },
        })
        .forEach((nodePath) => {
          const { node: initializedNode } = nodePath;

          root
            .find(
              j.VariableDeclarator,
              (obj) =>
                // Check if  sequelize.import or sequelize["import"]
                obj.init?.callee?.object?.name === initializedNode.id.name &&
                (obj.init?.callee?.property?.value === "import" ||
                  obj.init?.callee?.property?.name === "import")
            )
            .forEach((variablePath) => {
              const { node: variableDeclarator } = variablePath;

              const pathJoinArgument = variableDeclarator.init.arguments[0];

              // from: sequelize.import(path.join(__dirname, file));
              // creating: require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
              const t = j.callExpression(
                j.callExpression(j.identifier("require"), [pathJoinArgument]),
                [
                  j.identifier(initializedNode.id.name),
                  j.memberExpression(
                    j.identifier(sequelizeName),
                    j.identifier("DataTypes")
                  ),
                ]
              );

              variableDeclarator.init = t;

              return nodePath;
            });
        });
    });

  return root.toSource();
};

// return root
//   .find(j.ArrowFunctionExpression, {
//     loc: {
//       start: spreadFunction.loc.start,
//       end: spreadFunction.loc.end,
//     },
//   })
//   .replaceWith((nodePath) => {
//     const { node } = nodePath;

//     node.params = [arr];
//     return node;
//   });
