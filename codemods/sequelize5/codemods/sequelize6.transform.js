const j = require("jscodeshift");

module.exports = (fileInfo, api, options) => {
  const root = j(fileInfo.source);

  // find all .spread and change it with .then
  root
    .find(j.CallExpression, (obj) => obj.callee?.property?.name === "spread")
    .replaceWith((nodePath) => {
      const { node } = nodePath;

      node.callee.property.name = "then";

      return node;
    })
    .forEach((astPath) => {
      const { node } = astPath;
      // A callback function that is passed into a spread function
      const spreadFunction = node.arguments[0];

      if (spreadFunction) {
        // destructure parameters in stream (row)=>{} ([row])=>{}
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

  // fetch all the require("sequelize") imports
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
      // name of the variable to which is module assigned to
      const sequelizeName = node.id.name;

      root
        // searching initialization of the imported class. e.g. new Sequelize()
        .find(j.VariableDeclarator, {
          init: { type: "NewExpression", callee: { name: sequelizeName } },
        })
        .forEach((nodePath) => {
          const { node: initializedNode } = nodePath;

          root
            // Find all variables where is sequelize.import or sequelize["import"] on the init side
            // e.g. const model = sequelize.import(path.join(__dirname, file));
            .find(
              j.VariableDeclarator,
              (obj) =>
                obj.init?.callee?.object?.name === initializedNode.id.name &&
                (obj.init?.callee?.property?.value === "import" ||
                  obj.init?.callee?.property?.name === "import")
            )
            .forEach((variablePath) => {
              const { node: variableDeclarator } = variablePath;

              const pathJoinArgument = variableDeclarator.init.arguments[0];

              // creating from: sequelize.import(path.join(__dirname, file));
              // to: require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
              const modelRequire = j.callExpression(
                j.callExpression(j.identifier("require"), [pathJoinArgument]),
                [
                  j.identifier(initializedNode.id.name),
                  j.memberExpression(
                    j.identifier(sequelizeName),
                    j.identifier("DataTypes")
                  ),
                ]
              );

              // change the right side of the variable
              variableDeclarator.init = modelRequire;

              return nodePath;
            });
        });
    });

  return root.toSource();
};
